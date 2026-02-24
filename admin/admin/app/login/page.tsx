'use client';
import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import API from '../../api/api';
import bg from '../../assets/images/l5.jpg';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.login(formData.username, formData.password);
      const user = response.data;
      localStorage.setItem("user_id", user.user_id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("isloggedin", 'true');
      window.location.href = "/dashboard";
    } catch (e) {
      message.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* ── Background image ─────────────────────────────────────────────── */}
      <Image
        src={bg}
        alt="background"
        fill
        priority
        className="object-cover object-center"
        style={{ zIndex: 0 }}
      />

      {/* ── Dark scrim so form stays legible ─────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1 }}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400&display=swap');

        .field-input input,
        .field-input {
          background: transparent !important;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 14px;
          color: #fef9ef !important;
          letter-spacing: 0.02em;
        }

        .field-input .ant-input-prefix svg {
          color: rgba(254,249,239,0.3) !important;
        }

        .field-input,
        .field-input.ant-input-affix-wrapper {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.12) !important;
          border-radius: 0 !important;
          height: 52px;
          padding: 0 16px;
          box-shadow: none !important;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .field-input:hover,
        .field-input.ant-input-affix-wrapper:hover {
          border-color: rgba(255,255,255,0.25) !important;
          background: rgba(255,255,255,0.07) !important;
        }

        .field-input:focus-within,
        .field-input.ant-input-affix-wrapper-focused {
          border-color: rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.07) !important;
          box-shadow: none !important;
        }

        .field-input .ant-input-password-icon,
        .field-input .ant-input-suffix svg {
          color: rgba(254,249,239,0.25) !important;
        }
        .field-input .ant-input-password-icon:hover {
          color: rgba(254,249,239,0.4) !important;
        }






      `}</style>

      {/* ── Glassmorphic card ─────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-[400px] mx-6 px-10 py-12"
        style={{
          zIndex: 2,
          background: 'rgba(10, 10, 10, 0.45)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-5"
            style={{ color: 'rgba(254,249,239,0.35)', fontFamily: '"Inter", sans-serif' }}
          >
            Admin Portal
          </p>
          <h1
            className="text-5xl leading-none mb-4"
            style={{
              color: '#fef9ef',
              fontFamily: '"EB Garamond", serif',
              fontWeight: 400,
              letterSpacing: '0.04em',
            }}
          >
            Sign in
          </h1>
          <div style={{ width: '32px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            <div>
              <label
                className="block mb-2 text-[10px] tracking-[0.12em] uppercase"
                style={{ color: 'rgba(254,249,239,0.35)', fontFamily: '"Inter", sans-serif' }}
              >
                Username
              </label>
              <Input
                size="large"
                value={formData.username}
                onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                className="field-input"
              />
            </div>

            <div>
              <label
                className="block mb-2 text-[10px] tracking-[0.12em] uppercase"
                style={{ color: 'rgba(254,249,239,0.35)', fontFamily: '"Inter", sans-serif' }}
              >
                Password
              </label>
              <Input.Password
                size="large"
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                className="text-[15px]!"
              />
            </div>

            <div className="pt-5">
              <Button
                htmlType="submit"
                loading={loading}
                block
                className="text-[10px] tracking-[0.05rem] uppercase bg-[#ac0902]! border-[#ac0902]! hover:bg-[#ac0902] hover:border-[#ac0902]! text-white! py-5!"
              >
                Continue
              </Button>
            </div>

          </div>
        </form>

        {/* Footer */}
        <p
          className="mt-10 text-center text-[10px] tracking-[0.15em] uppercase"
          style={{ color: 'rgba(254,249,239,0.18)', fontFamily: '"Inter", sans-serif' }}
        >
          SATTVA 26 · CUCEK
        </p>
      </div>
    </div>
  );
};

export default LoginPage;