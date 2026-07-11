'use client';

import { useState, useEffect } from 'react';
import { Mail, KeyRound, User as UserIcon, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/components/api';
import { useRouter } from 'next/navigation';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export default function Login() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Đăng ký tài khoản thất bại.');
      setBusy(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .login-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .brand-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
          color: #fff;
          text-align: center;
        }
        .brand-logo svg {
          color: #6366f1;
          margin-bottom: 12px;
        }
        .brand-logo h1 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .brand-logo p {
          color: #94a3b8;
          font-size: 13px;
          margin: 4px 0 0 0;
        }
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }
        .form-group label {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-wrapper svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
        .form-group input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 14.5px;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .form-group input:focus {
          border-color: #6366f1;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #4f46e5 0%, #6366f1 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          margin-top: 10px;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #f87171;
          padding: 12px;
          font-size: 13.5px;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 13.5px;
          color: #94a3b8;
        }
        .auth-link {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .auth-link:hover {
          color: #a5b4fc;
          text-decoration: underline;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13.5px;
          margin-bottom: 24px;
          padding: 0;
        }
        .back-link:hover {
          color: #fff;
        }
        .auth-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-card">
        {view !== 'login' && (
          <button className="back-link" onClick={() => setView('login')}>
            <ArrowLeft size={16} /> Quay lại đăng nhập
          </button>
        )}

        <div className="brand-logo">
          <ShieldCheck size={48} />
          <h1>ProductGuard AI</h1>
          <p>Hệ thống Thẩm định & Giám sát Tuân thủ</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email hoặc Số điện thoại</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="text"
                  placeholder="nhanvien@domain.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <KeyRound size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={busy}>
              {busy ? <Loader2 className="auth-spinner" size={18} /> : null}
              {busy ? 'Đang xác thực...' : 'Đăng nhập'}
              {!busy ? <ArrowRight size={18} /> : null}
            </button>

            <div className="auth-footer">
              Chưa có tài khoản?{' '}
              <button type="button" className="auth-link" onClick={() => { setError(''); setView('register'); }}>
                Đăng ký thành viên
              </button>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Họ và Tên</label>
              <div className="input-wrapper">
                <UserIcon size={18} />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="nhanvien@domain.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <KeyRound size={18} />
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={busy}>
              {busy ? <Loader2 className="auth-spinner" size={18} /> : null}
              {busy ? 'Đang khởi tạo tài khoản...' : 'Đăng ký tài khoản'}
              {!busy ? <ArrowRight size={18} /> : null}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
