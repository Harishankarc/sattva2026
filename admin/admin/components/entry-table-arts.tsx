'use client';
import React, { useState } from 'react';
import { Input, Button, Select, InputNumber, Upload, message, Table, Modal } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const theme = {
  bg: "#0a0a0a",
  card: "rgba(17, 17, 17, 0.6)",
  navBg: "rgba(17, 17, 17, 0.4)",
  primary: "#7f1d1d",
  primaryHover: "#991b1b",
  border: "rgba(255,255,255,0.08)",
  text: "#fef9ef",
  muted: "rgba(254, 249, 239, 0.45)",
};

interface EntryData {
  key: string;
  name: string;
  category: string;
  subcategory: string;
  rank: number | null;
  points: number;
  description: string;
}

const EntryForm: React.FC = () => {
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    rank: null as number | null,
    points: 0,
    description: ''
  });
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);

  const categories = {
    sports: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Tennis', 'Badminton'],
    arts: ['Music', 'Dance', 'Drama', 'Painting', 'Photography', 'Poetry'],
    department: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical']
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEntry = () => {
    if (!formData.name || !formData.category || !formData.subcategory) {
      message.error('Please fill all required fields');
      return;
    }

    const newEntry: EntryData = {
      key: Date.now().toString(),
      ...formData
    };

    setEntries([...entries, newEntry]);

    // Reset form
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      rank: null,
      points: 0,
      description: ''
    });

    message.success('Entry added successfully');
  };

  const handleDeleteEntry = (key: string) => {
    setEntries(entries.filter(entry => entry.key !== key));
    message.success('Entry deleted');
  };

  const handleSaveAll = () => {
    // console.log('Saving entries:', entries);
    message.success(`${entries.length} entries saved successfully`);
  };

  const handleBulkUpload: UploadProps['customRequest'] = ({ file, onSuccess }) => {
    // Simulate CSV parsing
    setTimeout(() => {
      message.success(`${(file as File).name} uploaded successfully`);
      
      const bulkEntries: EntryData[] = [
        {
          key: Date.now().toString() + '1',
          name: 'Team Alpha',
          category: 'sports',
          subcategory: 'Cricket',
          rank: 1,
          points: 100,
          description: 'First place winners'
        },
        {
          key: Date.now().toString() + '2',
          name: 'Team Beta',
          category: 'sports',
          subcategory: 'Cricket',
          rank: 2,
          points: 75,
          description: 'Second place'
        }
      ];
      setEntries([...entries, ...bulkEntries]);
      setIsBulkModalVisible(false);
      onSuccess?.(null as any);
    }, 1000);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '12%',
      render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      width: '15%'
    },
    {
      title: 'Rank/Position',
      dataIndex: 'rank',
      key: 'rank',
      width: '12%',
      render: (rank: number | null) => rank || '-'
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      width: '10%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '21%',
      ellipsis: true
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_: any, record: EntryData) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteEntry(record.key)}
          style={{
            color: theme.muted,
            border: 'none',
            background: 'transparent'
          }}
        />
      )
    }
  ];

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: theme.bg }}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        .glass-card {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .premium-input input,
        .premium-input textarea,
        .premium-input .ant-select-selector,
        .premium-input {
          font-family: 'Inter', sans-serif !important;
          font-weight: 300 !important;
          letter-spacing: 0.01em !important;
          background: transparent !important;
          color: ${theme.text} !important;
        }

        .premium-input:hover,
        .premium-input:hover .ant-select-selector {
          border-color: rgba(255,255,255,0.15) !important;
        }

        .premium-input:focus,
        .premium-input:focus-within,
        .premium-input .ant-select-focused .ant-select-selector {
          border-color: rgba(255,255,255,0.25) !important;
          box-shadow: none !important;
        }

        .premium-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-button:hover {
          transform: translateY(-1px);
        }

        .ant-table {
          background: transparent !important;
          color: ${theme.text} !important;
        }

        .ant-table-thead > tr > th {
          background: ${theme.card} !important;
          color: ${theme.text} !important;
          border-bottom: 1px solid ${theme.border} !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          font-size: 0.6875rem !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
        }

        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${theme.border} !important;
          background: transparent !important;
          color: ${theme.text} !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 300 !important;
        }

        .ant-table-tbody > tr:hover > td {
          background: ${theme.card} !important;
        }

        .ant-select-dropdown {
          background: ${theme.card} !important;
          border: 1px solid ${theme.border} !important;
          backdrop-filter: blur(20px) !important;
        }

        .ant-select-item {
          color: ${theme.text} !important;
          font-family: 'Inter', sans-serif !important;
        }

        .ant-select-item-option-selected {
          background: rgba(127, 29, 29, 0.3) !important;
        }

        .ant-select-item-option-active {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .ant-modal-content {
          background: ${theme.card} !important;
          border: 1px solid ${theme.border} !important;
          backdrop-filter: blur(20px) !important;
        }

        .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid ${theme.border} !important;
        }

        .ant-modal-title {
          color: ${theme.text} !important;
          font-family: 'Inter', sans-serif !important;
        }

        .ant-modal-close {
          color: ${theme.muted} !important;
        }

        .ant-input-number {
          background: transparent !important;
          border-color: ${theme.border} !important;
          color: ${theme.text} !important;
        }

        .ant-input-number-input {
          color: ${theme.text} !important;
        }

        .ant-upload {
          color: ${theme.text} !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-medium tracking-[0.15em] mb-2"
            style={{
              color: theme.text,
              fontFamily: '"EB Garamond", serif'
            }}
          >
            Entry Form
          </h1>
          <p
            style={{
              color: theme.muted,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 300
            }}
          >
            Add individual entries or upload bulk data
          </p>
        </div>

        {/* Form Card */}
        <div
          className="glass-card border p-8 mb-8"
          style={{
            background: theme.card,
            borderColor: theme.border,
            borderRadius: '2px'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Name / Team Name *
              </label>
              <Input
                size="large"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="premium-input"
                style={{
                  borderColor: theme.border,
                  borderRadius: '1px',
                  height: '48px'
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Category *
              </label>
              <Select
                size="large"
                placeholder="Select category"
                value={formData.category || undefined}
                onChange={(value) => {
                  handleInputChange('category', value);
                  handleInputChange('subcategory', '');
                }}
                className="premium-input w-full"
                style={{
                  borderRadius: '1px',
                  height: '48px'
                }}
              >
                <Option value="sports">Sports</Option>
                <Option value="arts">Arts</Option>
                <Option value="department">Department</Option>
              </Select>
            </div>

            {/* Subcategory */}
            <div>
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Subcategory *
              </label>
              <Select
                size="large"
                placeholder="Select subcategory"
                value={formData.subcategory || undefined}
                onChange={(value) => handleInputChange('subcategory', value)}
                disabled={!formData.category}
                className="premium-input w-full"
                style={{
                  borderRadius: '1px',
                  height: '48px'
                }}
              >
                {formData.category && categories[formData.category as keyof typeof categories].map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </div>

            {/* Rank/Position */}
            <div>
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Rank / Position
              </label>
              <InputNumber
                size="large"
                placeholder="Enter rank"
                value={formData.rank}
                onChange={(value) => handleInputChange('rank', value)}
                min={1}
                className="premium-input w-full"
                style={{
                  borderColor: theme.border,
                  borderRadius: '1px',
                  height: '48px',
                  width: '100%'
                }}
              />
            </div>

            {/* Points */}
            <div>
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Points
              </label>
              <InputNumber
                size="large"
                placeholder="Enter points"
                value={formData.points}
                onChange={(value) => handleInputChange('points', value || 0)}
                min={0}
                className="premium-input w-full"
                style={{
                  borderColor: theme.border,
                  borderRadius: '1px',
                  height: '48px',
                  width: '100%'
                }}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                className="block mb-3 text-[0.6875rem] tracking-[0.1em] uppercase"
                style={{
                  color: theme.muted,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400
                }}
              >
                Description
              </label>
              <TextArea
                rows={3}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="premium-input"
                style={{
                  borderColor: theme.border,
                  borderRadius: '1px'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddEntry}
              icon={<PlusOutlined />}
              className="premium-button"
              style={{
                background: theme.primary,
                border: 'none',
                color: theme.text,
                height: '48px',
                borderRadius: '1px',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0 32px'
              }}
            >
              Add Entry
            </Button>

            <Button
              onClick={() => setIsBulkModalVisible(true)}
              icon={<UploadOutlined />}
              className="premium-button"
              style={{
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.text,
                height: '48px',
                borderRadius: '1px',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0 32px'
              }}
            >
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Entries Table */}
        {entries.length > 0 && (
          <div
            className="glass-card border p-8"
            style={{
              background: theme.card,
              borderColor: theme.border,
              borderRadius: '2px'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-medium tracking-[0.1em]"
                style={{
                  color: theme.text,
                  fontFamily: '"EB Garamond", serif'
                }}
              >
                Entries ({entries.length})
              </h2>

              <Button
                onClick={handleSaveAll}
                icon={<SaveOutlined />}
                className="premium-button"
                style={{
                  background: theme.primary,
                  border: 'none',
                  color: theme.text,
                  height: '40px',
                  borderRadius: '1px',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0 24px'
                }}
              >
                Save All
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={entries}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      <Modal
        title="Bulk Upload"
        open={isBulkModalVisible}
        onCancel={() => setIsBulkModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className="py-4">
          <p
            className="mb-4"
            style={{
              color: theme.muted,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 300,
              lineHeight: '1.6'
            }}
          >
            Upload a CSV file with the following columns: Name, Category, Subcategory, Rank, Points, Description
          </p>

          <Upload
            customRequest={handleBulkUpload}
            accept=".csv"
            showUploadList={false}
            maxCount={1}
          >
            <Button
              icon={<UploadOutlined />}
              className="premium-button"
              style={{
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.text,
                height: '48px',
                borderRadius: '1px',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                width: '100%'
              }}
            >
              Select CSV File
            </Button>
          </Upload>

          <div className="mt-4">
            <a
              href="#"
              style={{
                color: theme.primary,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              Download CSV Template
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EntryForm;