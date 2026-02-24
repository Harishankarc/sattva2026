'use client';
import React, { useEffect, useState } from 'react';
import { Button, Select, message } from 'antd';
import {
  LogoutOutlined, TrophyOutlined, PictureOutlined, BankOutlined,
  PlusOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, BuildOutlined,
} from '@ant-design/icons';

import { useRouter } from 'next/navigation';

import API from '../../api/api'

const { Option } = Select;

const theme = {
  bg: "#ffffff",
  sidebar: "#fafafa",
  card: "#ffffff",
  border: "rgba(220, 38, 38, 0.12)",
  borderHover: "rgba(220, 38, 38, 0.4)",
  text: "#0f0f0f",
  muted: "rgba(15, 15, 15, 0.4)",
  mutedLight: "rgba(15, 15, 15, 0.2)",
  accent: "#dc2626",
  accentDark: "#b91c1c",
  accentLight: "#ef4444",
  accentMuted: "rgba(220, 38, 38, 0.07)",
  inputBg: "rgba(220, 38, 38, 0.03)",
  inputBorder: "rgba(220, 38, 38, 0.18)",
  inputFocus: "#dc2626",
  glowRed: "rgba(220, 38, 38, 0.18)",
};

const DEFAULT_DEPARTMENTS = [
  'Computer Science', 'Mechanical', 'Electrical', 'Civil',
  'Electronics', 'Chemical', 'Biotechnology', 'Architecture'
];

type EntryRow = {
  id: number;
  position: string;
  name: string;
  department: string;
  marks: string;
  participantcode: string;
  categorycode: string;
};

const emptyRow = (): EntryRow => ({
  id: Date.now() + Math.random(),
  position: '',
  name: '',
  department: '',
  marks: '',
  participantcode: '',
  categorycode: '',
});

type Section = 'sports' | 'arts' | 'department';

const NAV = [
  { id: 'sports' as Section, label: 'Sports', icon: <TrophyOutlined /> },
  { id: 'arts' as Section, label: 'Arts', icon: <PictureOutlined /> },
  // { id: 'department' as Section, label: 'Department', icon: <BankOutlined /> },
];

const DEPT_COLORS = [
  '#dc2626', '#b91c1c', '#ef4444', '#c2410c',
  '#92400e', '#15803d', '#1d4ed8', '#7c3aed',
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Section>('sports');
  const [entries, setEntries] = useState<EntryRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);

  // Departments state
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [deptError, setDeptError] = useState('');
  const [savingDept, setSavingDept] = useState(false);

  const addRow = () => setEntries(prev => [...prev, emptyRow()]);
  const removeRow = (id: number) =>
    setEntries(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  const updateRow = (id: number, field: keyof EntryRow, value: string) =>
    setEntries(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const handleSave = async () => {
    const incomplete = entries.some(r => !r.name || !r.department || !r.marks);
    if (incomplete) { message.warning('Please fill all fields before saving'); return; }

    setSaving(true);
    try {
      const participants = entries.map(r => ({
        name: r.name,
        participantCode: r.participantcode,
        categoryCode: r.categorycode,
        mark: r.marks,
        dept_id: r.department,
        position: r.position,
      }));

      const response = await API.saveSportsData({ participants });

      if (response.data.status) {
        message.success('Data saved successfully');
        setEntries([emptyRow()]);
      } else {
        message.error('Error saving data');
      }
    } catch (e) {
      message.error('Failed to reach server');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };


  const [artsEntries, setArtsEntries] = useState<EntryRow[]>([emptyRow()]);
  const [savingArts, setSavingArts] = useState(false);

  const addArtsRow = () => setArtsEntries(prev => [...prev, emptyRow()]);
  const removeArtsRow = (id: number) =>
    setArtsEntries(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  const updateArtsRow = (id: number, field: keyof EntryRow, value: string) =>
    setArtsEntries(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const handleArtsSave = async () => {
    // console.log(artsEntries);
    const incomplete = artsEntries.some(r => !r.name || !r.department || !r.marks);
    if (incomplete) { message.warning('Please fill all fields before saving'); return; }

    setSavingArts(true);
    try {
      const participants = artsEntries.map(r => ({
        name: r.name,
        participantCode: r.participantcode,
        categoryCode: r.categorycode,
        mark: r.marks,
        dept_id: r.department,
        position: r.position,
      }));
      const response = await API.saveArtsData({ participants });
      if (response.data.status) {
        message.success('Arts data saved successfully');
        setArtsEntries([emptyRow()]);
      } else {
        message.error('Error saving arts data');
      }
    } catch (e) {
      message.error('Failed to reach server');
    } finally {
      setSavingArts(false);
    }
  };

  const openModal = () => {
    setNewDeptName('');
    setDeptError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewDeptName('');
    setDeptError('');
  };

  const removeDept = (name: string) => {
    setDepartments(prev => prev.filter(d => d !== name));
    message.info(`"${name}" removed`);
  };

  async function fetchDepartments(){
    try{
      const response = await API.getdepartment();
      const data = response.data;
      setDepartments(data);
      // console.log(data);
    }catch(e){
      // console.log("fetchDepartments error", e);
    }
  }

  useEffect(()=>{
    fetchDepartments();
  },[])

  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isloggedin') === 'true';

    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) return null;


  return (
    <div className="min-h-screen flex" style={{ background: theme.bg }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .entry-select .ant-select-selector {
          background: ${theme.inputBg} !important;
          border-color: ${theme.inputBorder} !important;
          border-radius: 6px !important;
          height: 44px !important;
          padding: 0 12px !important;
          box-shadow: none !important;
          color: ${theme.text} !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 400 !important;
          font-size: 13px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          align-items: center !important;
          display: flex !important;
        }
        .entry-select .ant-select-selector:hover { border-color: ${theme.accentLight} !important; }
        .entry-select.ant-select-focused .ant-select-selector {
          border-color: ${theme.inputFocus} !important;
          box-shadow: 0 0 0 3px ${theme.glowRed} !important;
        }
        .entry-select .ant-select-selection-placeholder { color: ${theme.muted} !important; line-height: 44px !important; }
        .entry-select .ant-select-selection-item { line-height: 44px !important; color: ${theme.text} !important; }
        .entry-select .ant-select-arrow svg { color: ${theme.muted}; }

        .entry-select-dropdown {
          background: #fff !important;
          border: 1px solid ${theme.inputBorder} !important;
          border-radius: 8px !important;
          padding: 4px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
        }
        .entry-select-dropdown .ant-select-item {
          color: ${theme.muted} !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          border-radius: 4px !important;
          padding: 8px 12px !important;
        }
        .entry-select-dropdown .ant-select-item-option-active,
        .entry-select-dropdown .ant-select-item-option-selected {
          background: ${theme.accentMuted} !important;
          color: ${theme.accent} !important;
        }

        .entry-field {
          background: ${theme.inputBg} !important;
          border: 1px solid ${theme.inputBorder} !important;
          border-radius: 6px !important;
          height: 44px !important;
          color: ${theme.text} !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 400 !important;
          font-size: 13px !important;
          padding: 0 12px !important;
          box-shadow: none !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          width: 100%;
        }
        .entry-field::placeholder { color: ${theme.mutedLight} !important; }
        .entry-field:hover { border-color: rgba(220,38,38,0.35) !important; }
        .entry-field:focus {
          border-color: ${theme.inputFocus} !important;
          // box-shadow: 0 0 0 3px ${theme.glowRed} !important;
          outline: none !important;
        }

        /* Modal input */
        .modal-input {
          width: 100%;
          height: 48px;
          background: #fff;
          border: 1.5px solid rgba(220,38,38,0.2);
          border-radius: 8px;
          color: #0f0f0f;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 0 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-input::placeholder { color: rgba(15,15,15,0.3); }
        .modal-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.15);
        }

        /* Dept card hover */
        .dept-card:hover .dept-delete { opacity: 1 !important; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(220,38,38,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(220,38,38,0.45); }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-box { animation: modalIn 0.2s ease; }
      `}</style>

      <aside className="fixed left-0 top-0 h-full flex flex-col" style={{ width: '220px', background: theme.sidebar, borderRight: `1px solid rgba(220,38,38,0.1)`, zIndex: 50 }}>
        <div className="px-7 py-8 border-b" style={{ borderColor: 'rgba(220,38,38,0.08)' }}>
          <div style={{ width: '28px', height: '4px', background: `linear-gradient(90deg, #dc2626, #ef4444)`, borderRadius: '2px', marginBottom: '14px' }} />
          <h1 className="text-2xl tracking-[0.05em]" style={{ fontFamily: '"Syne", sans-serif', color: theme.text, fontWeight: 700 }}>SATTVA</h1>
          <p className="text-[9px] tracking-[0.25em] uppercase mt-1" style={{ color: theme.muted, fontFamily: '"DM Sans", sans-serif' }}>Admin · 2026</p>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {NAV.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                style={{
                  background: active ? theme.accentMuted : 'transparent',
                  borderLeft: active ? `3px solid ${theme.accent}` : '3px solid transparent',
                  borderRadius: '0 6px 6px 0',
                  color: active ? theme.accent : theme.muted,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '11px', fontWeight: active ? 600 : 400,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', border: 'none',
                  // borderLeft: active ? `3px solid ${theme.accent}` : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.04)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.color = theme.muted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; } }}
              >
                <span style={{ fontSize: '14px', color: active ? theme.accent : 'inherit' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-6 border-t" style={{ borderColor: 'rgba(220,38,38,0.08)' }}>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200"
            style={{ background: 'transparent', border: `1px solid rgba(220,38,38,0.15)`, borderRadius: '6px', color: theme.muted, fontFamily: '"DM Sans", sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.accent; (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = theme.accentMuted; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = theme.muted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <LogoutOutlined style={{ fontSize: '13px' }} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen" style={{ marginLeft: '220px', background: '#f7f7f7' }}>

        <div className="sticky top-0 z-40 px-10 py-5 flex items-center justify-between border-b"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderColor: 'rgba(220,38,38,0.1)' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.accent }} />
            <h2 className="text-xl tracking-[0.08em]" style={{ color: theme.text, fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
              {NAV.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          {activeTab === 'sports' && (
            <Button onClick={handleSave} loading={saving}
              style={{ background: theme.accentDark, border: 'none', color: '#fff', height: '42px', borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', textTransform: '', padding: '0 24px', boxShadow: `0 4px 16px ${theme.glowRed}` }}>
              Save All
            </Button>
          )}

          {activeTab === 'arts' && (
            <Button onClick={handleArtsSave} loading={savingArts}
              style={{ background: theme.accentDark, border: 'none', color: '#fff', height: '42px', borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', padding: '0 24px', boxShadow: `0 4px 16px ${theme.glowRed}` }}>
              Save All
            </Button>
          )}

          {activeTab === 'department' && (
            <button onClick={openModal}
              className="flex items-center gap-2 transition-all duration-200"
              style={{ background: theme.accent, border: 'none', color: '#fff', height: '42px', borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 24px', boxShadow: `0 4px 16px ${theme.glowRed}`, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = theme.accentDark}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = theme.accent}
            >
              <PlusOutlined style={{ fontSize: '13px' }} />
              Add Department
            </button>
          )}
        </div>

        <div className="px-10 py-8">

          {activeTab === 'sports' && (
            <div>
              <div className="grid mb-3 px-4" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 1fr 90px 44px', gap: '10px' }}>
                {['Position', 'Full Name',"Category Code", "Participant Code",'Department', 'Marks / Score', '', ''].map((h, i) => (
                  <span key={i} className="text-[9px] tracking-[0.18em] uppercase"
                    style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, opacity: h ? 1 : 0 }}>{h}</span>
                ))}
              </div>
              <div className="space-y-2">
                {entries.map((row, idx) => (
                  <div key={row.id} className="grid items-center px-4 py-3 transition-all duration-150"
                    style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 1fr 90px 44px', gap: '10px', background: '#ffffff', border: `1px solid rgba(220,38,38,0.1)`, borderRadius: '10px', boxShadow: `0 1px 6px rgba(0,0,0,0.05)` }}>
                    <input type="text" inputMode="numeric" placeholder="" value={row.position} onChange={e => updateRow(row.id, 'position', e.target.value)} className="entry-field" style={{ textAlign: 'center' }} />
                    <input type="text" placeholder="" value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} className="entry-field" />
                    <input type="text" placeholder="" value={row.categorycode} onChange={e => updateRow(row.id, 'categorycode', e.target.value)} className="entry-field" />
                    <input type="text" placeholder="" value={row.participantcode} onChange={e => updateRow(row.id, 'participantcode', e.target.value)} className="entry-field" />
                    <Select className="entry-select" popupClassName="entry-select-dropdown" placeholder="" value={row.department || undefined} onChange={val => updateRow(row.id, 'department', val)} style={{ width: '100%', height: '44px' }}>
                      {departments.map(d => <Option key={d['id']} value={d['id']}>{d['dept_name']}</Option>)}
                    </Select>
                    <input type="text" inputMode="numeric" placeholder="" value={row.marks} onChange={e => updateRow(row.id, 'marks', e.target.value)} className="entry-field" />
                    <div className="text-center text-[10px] tracking-wider"
                      style={{ color: theme.accent, fontFamily: '"Syne", sans-serif', fontVariantNumeric: 'tabular-nums', fontWeight: 700, background: theme.accentMuted, borderRadius: '4px', padding: '2px 0', border: `1px solid rgba(220,38,38,0.15)` }}>
                      #{String(idx + 1).padStart(2, '0')}
                    </div>
                    <button onClick={() => removeRow(row.id)} className="flex items-center justify-center transition-all duration-200"
                      style={{ width: '44px', height: '44px', background: 'transparent', border: `1px solid transparent`, borderRadius: '6px', color: 'rgba(220,38,38,0.25)', cursor: 'pointer', opacity: entries.length === 1 ? 0.3 : 1 }}
                      onMouseEnter={e => { if (entries.length > 1) { (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = theme.accentMuted; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
                      disabled={entries.length === 1} title="Remove row">
                      <DeleteOutlined style={{ fontSize: '13px' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addRow} className="mt-4 flex items-center gap-2 px-4 py-3 w-full transition-all duration-200"
                style={{ background: 'transparent', border: `1.5px dashed rgba(220,38,38,0.2)`, borderRadius: '10px', color: theme.muted, fontFamily: '"DM Sans", sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', justifyContent: 'center' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.accent; (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = theme.accentMuted; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = theme.muted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <PlusOutlined style={{ fontSize: '12px' }} /> Add Entry
              </button>
              {entries.length > 1 && (
                <div className="mt-6 px-6 py-5 flex items-center gap-10"
                  style={{ background: '#ffffff', border: `1px solid rgba(220,38,38,0.12)`, borderLeft: `4px solid ${theme.accent}`, borderRadius: '10px', boxShadow: `0 2px 12px rgba(220,38,38,0.06)` }}>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Entries queued</p>
                    <p className="text-2xl" style={{ color: theme.text, fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>{entries.length}</p>
                  </div>
                  <div style={{ width: '1px', height: '36px', background: 'rgba(220,38,38,0.12)' }} />
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Ready to save</p>
                    <p className="text-2xl" style={{ color: theme.text, fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>{entries.filter(r => r.name && r.department && r.marks).length}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'arts' && (
            <div>
              <div className="grid mb-3 px-4" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 1fr 90px 44px', gap: '10px' }}>
                {['Position', 'Full Name', 'Category Code', 'Participant Code', 'Department', 'Marks / Score', '', ''].map((h, i) => (
                  <span key={i} className="text-[9px] tracking-[0.18em] uppercase"
                    style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, opacity: h ? 1 : 0 }}>{h}</span>
                ))}
              </div>
              <div className="space-y-2">
                {artsEntries.map((row, idx) => (
                  <div key={row.id} className="grid items-center px-4 py-3 transition-all duration-150"
                    style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 1fr 90px 44px', gap: '10px', background: '#ffffff', border: `1px solid rgba(220,38,38,0.1)`, borderRadius: '10px', boxShadow: `0 1px 6px rgba(0,0,0,0.05)` }}>
                    <input type="text" inputMode="numeric" placeholder="" value={row.position} onChange={e => updateArtsRow(row.id, 'position', e.target.value)} className="entry-field" style={{ textAlign: 'center' }} />
                    <input type="text" placeholder="" value={row.name} onChange={e => updateArtsRow(row.id, 'name', e.target.value)} className="entry-field" />
                    <input type="text" placeholder="" value={row.categorycode} onChange={e => updateArtsRow(row.id, 'categorycode', e.target.value)} className="entry-field" />
                    <input type="text" placeholder="" value={row.participantcode} onChange={e => updateArtsRow(row.id, 'participantcode', e.target.value)} className="entry-field" />
                    <Select className="entry-select" popupClassName="entry-select-dropdown" placeholder="" value={row.department || undefined} onChange={val => updateArtsRow(row.id, 'department', val)} style={{ width: '100%', height: '44px' }}>
                      {departments.map(d => <Option key={d['id']} value={d['id']}>{d['dept_name']}</Option>)}
                    </Select>
                    <input type="text" inputMode="numeric" placeholder="" value={row.marks} onChange={e => updateArtsRow(row.id, 'marks', e.target.value)} className="entry-field" />
                    <div className="text-center text-[10px] tracking-wider"
                      style={{ color: theme.accent, fontFamily: '"Syne", sans-serif', fontVariantNumeric: 'tabular-nums', fontWeight: 700, background: theme.accentMuted, borderRadius: '4px', padding: '2px 0', border: `1px solid rgba(220,38,38,0.15)` }}>
                      #{String(idx + 1).padStart(2, '0')}
                    </div>
                    <button onClick={() => removeArtsRow(row.id)} className="flex items-center justify-center transition-all duration-200"
                      style={{ width: '44px', height: '44px', background: 'transparent', border: `1px solid transparent`, borderRadius: '6px', color: 'rgba(220,38,38,0.25)', cursor: 'pointer', opacity: artsEntries.length === 1 ? 0.3 : 1 }}
                      onMouseEnter={e => { if (artsEntries.length > 1) { (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = theme.accentMuted; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
                      disabled={artsEntries.length === 1} title="Remove row">
                      <DeleteOutlined style={{ fontSize: '13px' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addArtsRow} className="mt-4 flex items-center gap-2 px-4 py-3 w-full transition-all duration-200"
                style={{ background: 'transparent', border: `1.5px dashed rgba(220,38,38,0.2)`, borderRadius: '10px', color: theme.muted, fontFamily: '"DM Sans", sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', justifyContent: 'center' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.accent; (e.currentTarget as HTMLButtonElement).style.color = theme.accent; (e.currentTarget as HTMLButtonElement).style.background = theme.accentMuted; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = theme.muted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <PlusOutlined style={{ fontSize: '12px' }} /> Add Entry
              </button>
              {artsEntries.length > 1 && (
                <div className="mt-6 px-6 py-5 flex items-center gap-10"
                  style={{ background: '#ffffff', border: `1px solid rgba(220,38,38,0.12)`, borderLeft: `4px solid ${theme.accent}`, borderRadius: '10px', boxShadow: `0 2px 12px rgba(220,38,38,0.06)` }}>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Entries queued</p>
                    <p className="text-2xl" style={{ color: theme.text, fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>{artsEntries.length}</p>
                  </div>
                  <div style={{ width: '1px', height: '36px', background: 'rgba(220,38,38,0.12)' }} />
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Ready to save</p>
                    <p className="text-2xl" style={{ color: theme.text, fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>{artsEntries.filter(r => r.name && r.department && r.marks).length}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;