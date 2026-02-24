const express = require('express');
const sqlite = require('sqlite3').verbose();
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const querys = [
    `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_datetime DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS departments(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dept_code VARCHAR(50) UNIQUE NOT NULL,
        dept_name VARCHAR(255) NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_datetime DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS arts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        participant_code VARCHAR(10),
        category_code VARCHAR(255),
        mark INTEGER DEFAULT 0,
        dept_id INTEGER,
        position INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_datetime DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS sports(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        participant_code VARCHAR(10),
        category_code VARCHAR(255),
        mark INTEGER DEFAULT 0,
        dept_id INTEGER,
        position INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_datetime DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
];

const db = new sqlite.Database("./database.db");

for (let i = 0; i < querys.length; i++) {
    db.run(querys[i]);
}


// ==================== AUTH ROUTES ====================

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        res.json({
            message: "Login successful",
            user_id: row.id,
            username: row.username
        });
    });
});

// ==================== DEPARTMENT ROUTES ====================

app.get('/getDepartments', (req, res) => {
    const query = "SELECT * FROM departments WHERE is_active = 1 ORDER BY dept_name";

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

app.post('/addDepartment', (req, res) => {
    const { dept_code, dept_name } = req.body;

    if (!dept_code || !dept_name) {
        return res.status(400).json({ error: "Department code and name are required" });
    }

    const query = `INSERT INTO departments (dept_code, dept_name) VALUES (?, ?)`;

    db.run(query, [dept_code.toLowerCase(), dept_name], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Department added successfully", id: this.lastID });
    });
});

app.put('/updateDepartment/:id', (req, res) => {
    const { id } = req.params;
    const { dept_code, dept_name, is_active } = req.body;

    const query = `UPDATE departments
                   SET dept_code = ?, dept_name = ?, is_active = ?,
                       modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [dept_code.toLowerCase(), dept_name, is_active, id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Department updated successfully", changes: this.changes });
    });
});

app.delete('/deleteDepartment/:id', (req, res) => {
    const { id } = req.params;

    const query = `UPDATE departments
                   SET is_active = 0, modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Department deactivated successfully", changes: this.changes });
    });
});


app.get('/getAllArts', (req, res) => {
    const query = `
        SELECT a.*, d.dept_code, d.dept_name
        FROM arts a
        LEFT JOIN departments d ON a.dept_id = d.id
        WHERE a.is_active = 1
        ORDER BY a.created_datetime DESC
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

app.get('/getArts/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT a.*, d.dept_code, d.dept_name
        FROM arts a
        LEFT JOIN departments d ON a.dept_id = d.id
        WHERE a.id = ? AND a.is_active = 1
    `;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(404).json({ error: "Arts entry not found" });
        }
        res.json(row);
    });
});

app.post('/addarts', (req, res) => {
    const { participants } = req.body;

    if (!participants || !Array.isArray(participants)) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    console.log("Received Arts Participants:", participants);

    try {
        participants.map((participant) => {
            db.run(
                "INSERT INTO arts (name, participant_code, category_code, mark, dept_id, position) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    participant.name?.toLowerCase() || "",
                    participant.participantCode?.toLowerCase() || "",
                    participant.categoryCode?.toLowerCase() || "",
                    participant.mark,
                    participant.dept_id,
                    participant.position
                ]
            );
        });

        console.log("Arts data added successfully!");

        res.json({
            status: true,
            message: "Arts data received successfully"
        });

    } catch (e) {
        console.log({ "adding arts error": e });

        res.json({
            status: false,
            message: "Error saving arts data"
        });
    }
});

app.get('/getIndividualArts', (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    try {
        const query = `
            SELECT a.*, d.dept_code, d.dept_name
            FROM arts a
            LEFT JOIN departments d ON a.dept_id = d.id
            WHERE a.category_code = ? AND a.is_active = 1
        `;
        db.all(query, [code.toLowerCase()], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            console.log("Rows:", rows);
            res.json(rows);
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/updateArts/:id', (req, res) => {
    const { id } = req.params;
    const { name, participant_code, category_code, mark, dept_id, position } = req.body;

    const query = `UPDATE arts
                   SET name = ?, participant_code = ?, category_code = ?, mark = ?,
                       dept_id = ?, position = ?, modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [name, participant_code, category_code, mark, dept_id, position, id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Arts entry updated successfully", changes: this.changes });
    });
});

app.delete('/deleteArts/:id', (req, res) => {
    const { id } = req.params;

    const query = `UPDATE arts
                   SET is_active = 0, modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Arts entry deactivated successfully", changes: this.changes });
    });
});


app.get('/getAllSports', (req, res) => {
    const query = `
        SELECT s.*, d.dept_code, d.dept_name
        FROM sports s
        LEFT JOIN departments d ON s.dept_id = d.id
        WHERE s.is_active = 1
        ORDER BY s.created_datetime DESC
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

app.get('/getSports/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT s.*, d.dept_code, d.dept_name
        FROM sports s
        LEFT JOIN departments d ON s.dept_id = d.id
        WHERE s.id = ? AND s.is_active = 1
    `;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(404).json({ error: "Sports entry not found" });
        }
        res.json(row);
    });
});

app.post('/addsports', (req, res) => {
    const { participants } = req.body;
    if (!participants || !Array.isArray(participants)) {
        return res.status(400).json({ error: "Invalid data format" });
    }
    console.log("Received Participants:", participants);

    try {
        participants.map((participant) => {
            db.run(
                "INSERT INTO sports (name, participant_code, category_code, mark, dept_id, position) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    participant.name.toLowerCase(),
                    participant.participantCode.toLowerCase(),
                    participant.categoryCode.toLowerCase(),
                    participant.mark,
                    participant.dept_id,
                    participant.position
                ]
            );
        });
        console.log("Data added successfully!");
        res.json({
            status: true,
            message: "Data received successfully"
        });
    } catch (e) {
        res.json({
            status: false,
            message: "Error saving data" });
        console.log({ "adding error": e });
    }

});

app.get('/getIndividualSports', (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    try {
        const query = `
            SELECT s.*, d.dept_code, d.dept_name
            FROM sports s
            LEFT JOIN departments d ON s.dept_id = d.id
            WHERE s.category_code = ? AND s.is_active = 1
        `;
        db.all(query, [code.toLowerCase()], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            console.log("Rows:", rows);
            res.json(rows);
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/updateSports/:id', (req, res) => {
    const { id } = req.params;
    const { name, participant_code, category_code, mark, dept_id, position } = req.body;

    const query = `UPDATE sports
                   SET name = ?, participant_code = ?, category_code = ?, mark = ?,
                       dept_id = ?, position = ?, modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [name, participant_code, category_code, mark, dept_id, position, id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Sports entry updated successfully", changes: this.changes });
    });
});

app.delete('/deleteSports/:id', (req, res) => {
    const { id } = req.params;

    const query = `UPDATE sports
                   SET is_active = 0, modified_datetime = CURRENT_TIMESTAMP
                   WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Sports entry deactivated successfully", changes: this.changes });
    });
});


app.get('/getArtsPointTable', (req, res) => {
    const query = `
        SELECT d.dept_name, SUM(a.mark) AS total_marks
        FROM arts a
        INNER JOIN departments d ON a.dept_id = d.id
        WHERE a.is_active = 1 AND d.is_active = 1
        GROUP BY d.dept_name
        ORDER BY total_marks DESC
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        let modifiedBranches = rows.map(row => ({
            branch: row.dept_name,
            marks: row.total_marks
        }));

        console.log(modifiedBranches);
        res.json(modifiedBranches);
    });
});

app.get('/getSportsPointTable', (req, res) => {
    const query = `
        SELECT d.dept_name, SUM(s.mark) AS total_marks
        FROM sports s
        INNER JOIN departments d ON s.dept_id = d.id
        WHERE s.is_active = 1 AND d.is_active = 1
        GROUP BY d.dept_name
        ORDER BY total_marks DESC
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        let modifiedBranches = rows.map(row => ({
            branch: row.dept_name,
            marks: row.total_marks
        }));

        console.log(modifiedBranches);
        res.json(modifiedBranches);
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));