'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/components/api';

interface AuthResponse { token: string; user: { id: string; email: string; fullName: string; role: string } }
type View = 'login' | 'register';

export default function Login() {
  const router = useRouter();
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (localStorage.getItem('token')) router.replace('/dashboard'); }, [router]);

  const finish = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      finish(await api<AuthResponse>(view === 'login' ? '/auth/login' : '/auth/register', {
        method: 'POST',
        body: JSON.stringify(view === 'login' ? { identifier: email, password } : { email, password, fullName }),
      }));
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : view === 'login' ? 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' : 'Đăng ký tài khoản thất bại.');
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <style>{`
        .login-page{padding:0;max-width:none;margin:0;width:100%;min-height:100svh;display:grid;grid-template-columns:minmax(520px,1.12fr) minmax(500px,.88fr);font-family:'DM Sans',sans-serif;background:#fff;color:#1c1917}
        .auth-brand{position:relative;isolation:isolate;overflow:hidden;padding:54px clamp(46px,6vw,90px) 36px;color:#fff;background:linear-gradient(145deg,#ff9c31 0%,#ff7a18 43%,#f25a14 100%);display:flex;flex-direction:column}
        .auth-brand:before{content:'';position:absolute;z-index:-1;width:110%;aspect-ratio:1;border-radius:50%;right:10%;bottom:-68%;border:70px solid rgba(255,201,137,.27);box-shadow:0 0 0 1px rgba(255,255,255,.3)}
        .guardian-wordmark{display:grid;width:max-content;line-height:1}.guardian-wordmark b{font-size:43px;font-weight:500;letter-spacing:-2.3px}.guardian-wordmark small{text-align:right;font-size:13px;letter-spacing:3px;margin-top:5px}
        .brand-copy{margin:auto 0;width:min(590px,100%);padding:48px 0;animation:enter-left .65s cubic-bezier(.22,1,.36,1)}
        .brand-copy>strong{font-size:19px}.brand-copy h1{font-size:clamp(45px,4.3vw,67px);line-height:1.06;letter-spacing:-3px;margin:18px 0 25px}.brand-copy>p{font-size:19px;line-height:1.55;max-width:520px;color:rgba(255,255,255,.9)}
        .brand-points{list-style:none;padding:0;margin:32px 0 0;display:grid;gap:15px;font-weight:600}.brand-points li{display:flex;align-items:center;gap:13px}.brand-points span{display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:#fff;color:#16a34a;box-shadow:0 6px 18px rgba(150,48,0,.15)}
        .brand-foot{font-size:11px;color:rgba(255,255,255,.67)}
        .auth-side{position:relative;min-height:100svh;display:grid;place-items:center;padding:90px clamp(42px,6vw,94px) 55px}.language{position:absolute;right:clamp(38px,5vw,74px);top:34px;display:flex;border:1px solid #dedbd8;padding:3px;border-radius:999px;background:#fafaf9}.language button{border:0;background:transparent;width:52px;height:34px;border-radius:999px;color:#78716c;font-weight:800}.language .active{color:#fff;background:linear-gradient(135deg,#fa8c16,#f56419);box-shadow:0 4px 12px rgba(234,88,12,.24)}
        .auth-form-shell{width:min(430px,100%);animation:enter-up .6s .08s cubic-bezier(.22,1,.36,1) both}.mobile-brand{display:none;color:#ea580c;font-weight:800;align-items:center;gap:8px;margin-bottom:30px}.back{border:0;background:none;padding:0;margin:0 0 26px;color:#57534e;display:flex;align-items:center;gap:8px;font-weight:700;cursor:pointer}.back:hover{color:#ea580c;transform:translateX(-2px)}
        .auth-head{margin-bottom:30px}.auth-head h2{font-size:clamp(32px,3vw,41px);line-height:1.15;letter-spacing:-1.4px;margin:0 0 10px}.auth-head p{color:#78716c;margin:0;line-height:1.55}.auth-form{display:grid;gap:19px}.field{display:grid;gap:8px;font-size:13px;font-weight:700}.input{position:relative;display:flex;align-items:center}.input>svg{position:absolute;left:15px;color:#a8a29e;pointer-events:none}.input input{width:100%;height:54px;padding:0 47px 0 45px;border:1px solid #d6d3d1;border-radius:10px;background:#fff;color:#1c1917;font-size:15px;outline:0}.input input::placeholder{color:#a8a29e}.input input:hover{border-color:#a8a29e}.input input:focus{border-color:#f97316;background:#fffdfa;box-shadow:0 0 0 4px rgba(249,115,22,.12)}.input:focus-within>svg{color:#f97316}
        .show-password{position:absolute;right:10px;display:grid;place-items:center;width:36px;height:36px;border:0;border-radius:8px;background:transparent;color:#78716c;cursor:pointer}.show-password:hover{background:#fff7ed;color:#ea580c}.options{display:flex;justify-content:space-between;align-items:center;font-size:13px}.remember{display:flex;align-items:center;gap:8px;color:#57534e}.remember input{width:17px;height:17px;accent-color:#f97316}.text-button,.switch button{border:0;background:none;color:#ea580c;padding:0;font-weight:750;cursor:pointer}.text-button:hover,.switch button:hover{text-decoration:underline;text-underline-offset:3px;color:#c2410c}
        .submit{height:55px;margin-top:3px;border:0;border-radius:10px;background:linear-gradient(120deg,#fa8c16,#ff641e);color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 10px 24px rgba(234,88,12,.24)}.submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 30px rgba(234,88,12,.3)}.submit:disabled{opacity:.66}.switch{text-align:center;color:#78716c;margin:28px 0 0;font-size:13px}.error{padding:12px 14px;margin:0 0 20px;border:1px solid #fecaca;border-radius:9px;background:#fff1f2;color:#b91c1c;font-size:13px;line-height:1.45}.spin{animation:spin .8s linear infinite}
        @keyframes enter-left{from{opacity:0;transform:translateX(-20px)}}@keyframes enter-up{from{opacity:0;transform:translateY(17px)}}@keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:900px){.login-page{grid-template-columns:minmax(330px,.7fr) minmax(440px,1fr)}.auth-brand{padding:40px}.brand-copy h1{font-size:42px;letter-spacing:-2px}.brand-copy>p{font-size:16px}}
        @media(max-width:740px){.login-page{display:block;background:linear-gradient(160deg,#fff7ed,#fff 40%)}.auth-brand{display:none}.auth-side{padding:86px 22px 40px}.language{top:22px;right:22px}.mobile-brand{display:flex}.auth-head h2{font-size:32px}}
        @media(prefers-reduced-motion:reduce){.brand-copy,.auth-form-shell,.spin{animation:none}.submit,.back{transition:none}}
      `}</style>

      <section className="auth-brand" aria-label="Guardian ProductGuard AI">
        <div className="guardian-wordmark"><b>guardian</b><small>healthy beauty</small></div>
        <div className="brand-copy">
          <strong>ProductGuard AI</strong>
          <h1>Thẩm định sản phẩm, đơn giản hơn.</h1>
          <p>AI hỗ trợ thẩm định, giúp bạn đảm bảo tuân thủ nhanh chóng và chính xác.</p>
          <ul className="brand-points">
            {['Kiểm tra hồ sơ thông minh','Theo dõi tuân thủ rõ ràng','Quyết định có kiểm soát'].map((item)=><li key={item}><span><Check size={17} strokeWidth={3}/></span>{item}</li>)}
          </ul>
        </div>
        <small className="brand-foot">Guardian Vietnam · Product compliance platform</small>
      </section>

      <section className="auth-side">
        <div className="language" role="group" aria-label="Chọn ngôn ngữ"><button className="active" type="button" aria-pressed="true">VI</button><button type="button" aria-pressed="false">EN</button></div>
        <div className="auth-form-shell">
          <div className="mobile-brand"><ShieldCheck size={24}/> ProductGuard AI</div>
          {view==='register'&&<button className="back" type="button" onClick={()=>{setView('login');setError('')}}><ArrowLeft size={17}/>Quay lại đăng nhập</button>}
          <header className="auth-head">
            <h2>{view==='login'?'Chào mừng trở lại':'Bắt đầu cùng ProductGuard AI'}</h2>
            <p>{view==='login'?'Đăng nhập để tiếp tục quy trình thẩm định.':'Tạo tài khoản để bắt đầu quy trình thẩm định sản phẩm.'}</p>
          </header>
          {error&&<div className="error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            {view==='register'&&<label className="field">Họ và tên<span className="input"><UserRound size={19}/><input autoComplete="name" placeholder="Nguyễn Văn A" required value={fullName} onChange={e=>setFullName(e.target.value)}/></span></label>}
            <label className="field">{view==='login'?'Email hoặc số điện thoại':'Địa chỉ email'}<span className="input"><Mail size={19}/><input type={view==='login'?'text':'email'} autoComplete="email" placeholder={view==='login'?'Nhập email hoặc số điện thoại':'tenban@congty.com'} required value={email} onChange={e=>setEmail(e.target.value)}/></span></label>
            <label className="field">Mật khẩu<span className="input"><KeyRound size={19}/><input type={showPassword?'text':'password'} autoComplete={view==='login'?'current-password':'new-password'} minLength={view==='register'?6:undefined} placeholder={view==='login'?'Nhập mật khẩu':'Tối thiểu 6 ký tự'} required value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" className="show-password" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ẩn mật khẩu':'Hiện mật khẩu'}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></span></label>
            {view==='login'&&<div className="options"><label className="remember"><input type="checkbox" defaultChecked/>Ghi nhớ đăng nhập</label><button type="button" className="text-button">Quên mật khẩu?</button></div>}
            <button className="submit" disabled={busy}>{busy&&<Loader2 className="spin" size={19}/>} {busy?(view==='login'?'Đang xác thực...':'Đang tạo tài khoản...'):(view==='login'?'Đăng nhập':'Tạo tài khoản')} {!busy&&<ArrowRight size={20}/>}</button>
          </form>
          {view==='login'&&<p className="switch">Chưa có tài khoản? <button type="button" onClick={()=>{setView('register');setError('')}}>Đăng ký thành viên</button></p>}
        </div>
      </section>
    </main>
  );
}