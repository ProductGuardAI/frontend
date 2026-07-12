'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/components/api';
import { ProductGuardMark } from '@/components/shared';

interface AuthResponse { token: string; refreshToken?: string; user: { id: string; email: string; fullName: string; role: string } }
type View = 'login' | 'register' | 'forgot' | 'reset';
type Language = 'vi' | 'en';
const copy = {
  vi: { headline:'Th\u1ea9m \u0111\u1ecbnh s\u1ea3n ph\u1ea9m, \u0111\u01a1n gi\u1ea3n h\u01a1n.', promise:'AI h\u1ed7 tr\u1ee3 th\u1ea9m \u0111\u1ecbnh, gi\u00fap b\u1ea1n \u0111\u1ea3m b\u1ea3o tu\u00e2n th\u1ee7 nhanh ch\u00f3ng v\u00e0 ch\u00ednh x\u00e1c.', benefits:['Ki\u1ec3m tra h\u1ed3 s\u01a1 th\u00f4ng minh','Theo d\u00f5i tu\u00e2n th\u1ee7 r\u00f5 r\u00e0ng','Quy\u1ebft \u0111\u1ecbnh c\u00f3 ki\u1ec3m so\u00e1t'], language:'Ch\u1ecdn ng\u00f4n ng\u1eef', back:'Quay l\u1ea1i \u0111\u0103ng nh\u1eadp', welcome:'Ch\u00e0o m\u1eebng tr\u1edf l\u1ea1i', registerTitle:'B\u1eaft \u0111\u1ea7u c\u00f9ng ProductGuard AI', loginIntro:'\u0110\u0103ng nh\u1eadp \u0111\u1ec3 ti\u1ebfp t\u1ee5c quy tr\u00ecnh th\u1ea9m \u0111\u1ecbnh.', registerIntro:'T\u1ea1o t\u00e0i kho\u1ea3n \u0111\u1ec3 b\u1eaft \u0111\u1ea7u quy tr\u00ecnh th\u1ea9m \u0111\u1ecbnh s\u1ea3n ph\u1ea9m.', fullName:'H\u1ecd v\u00e0 t\u00ean', fullNamePlaceholder:'Nguy\u1ec5n V\u0103n A', identifier:'Email ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i', email:'\u0110\u1ecba ch\u1ec9 email', identifierPlaceholder:'Nh\u1eadp email ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i', emailPlaceholder:'tenban@congty.com', password:'M\u1eadt kh\u1ea9u', passwordPlaceholder:'Nh\u1eadp m\u1eadt kh\u1ea9u', newPasswordPlaceholder:'T\u1ed1i thi\u1ec3u 6 k\u00fd t\u1ef1', show:'Hi\u1ec7n m\u1eadt kh\u1ea9u', hide:'\u1ea8n m\u1eadt kh\u1ea9u', remember:'Ghi nh\u1edb \u0111\u0103ng nh\u1eadp', forgot:'Qu\u00ean m\u1eadt kh\u1ea9u?', login:'\u0110\u0103ng nh\u1eadp', register:'T\u1ea1o t\u00e0i kho\u1ea3n', loggingIn:'\u0110ang x\u00e1c th\u1ef1c...', registering:'\u0110ang t\u1ea1o t\u00e0i kho\u1ea3n...', noAccount:'Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n?', registerLink:'\u0110\u0103ng k\u00fd th\u00e0nh vi\u00ean', loginError:'\u0110\u0103ng nh\u1eadp th\u1ea5t b\u1ea1i.', registerError:'\u0110\u0103ng k\u00fd t\u00e0i kho\u1ea3n th\u1ea5t b\u1ea1i.', forgotTitle:'\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u', forgotIntro:'Nh\u1eadp email \u0111\u1ec3 nh\u1eadn m\u00e3 OTP \u0111\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u.', forgotSend:'G\u1eedi m\u00e3 OTP', forgotSending:'\u0110ang g\u1eedi...', otpLabel:'M\u00e3 OTP', otpPlaceholder:'Nh\u1eadp m\u00e3 6 ch\u1eef s\u1ed1', newPasswordLabel:'M\u1eadt kh\u1ea9u m\u1edbi', resetTitle:'\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u', resetIntro:'Nh\u1eadp m\u00e3 OTP v\u00e0 m\u1eadt kh\u1ea9u m\u1edbi.', resetButton:'\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u', resetSuccess:'\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u th\u00e0nh c\u00f4ng! B\u1ea1n c\u00f3 th\u1ec3 \u0111\u0103ng nh\u1eadp.', forgotSuccess:'M\u00e3 OTP \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi. Ki\u1ec3m tra email ho\u1eb7c nh\u1eadt k\u00fd h\u1ec7 th\u1ed1ng.' },
  en: { headline:'Product reviews, made simpler.', promise:'AI-assisted reviews help your team make faster, more accurate compliance decisions.', benefits:['Intelligent document checks','Clear compliance tracking','Controlled decisions'], language:'Choose language', back:'Back to sign in', welcome:'Welcome back', registerTitle:'Get started with ProductGuard AI', loginIntro:'Sign in to continue your product review workflow.', registerIntro:'Create an account to begin reviewing product submissions.', fullName:'Full name', fullNamePlaceholder:'Nguyen Van A', identifier:'Email or phone number', email:'Email address', identifierPlaceholder:'Enter your email or phone number', emailPlaceholder:'you@company.com', password:'Password', passwordPlaceholder:'Enter your password', newPasswordPlaceholder:'At least 6 characters', show:'Show password', hide:'Hide password', remember:'Remember me', forgot:'Forgot password?', login:'Sign in', register:'Create account', loggingIn:'Signing in...', registering:'Creating account...', noAccount:'New to ProductGuard AI?', registerLink:'Create an account', loginError:'Sign-in failed. Please check your details.', registerError:'Account creation failed. Please try again.', forgotTitle:'Reset password', forgotIntro:'Enter your email to receive a reset OTP.', forgotSend:'Send OTP', forgotSending:'Sending...', otpLabel:'OTP code', otpPlaceholder:'Enter the 6-digit code', newPasswordLabel:'New password', resetTitle:'Reset password', resetIntro:'Enter the OTP and your new password.', resetButton:'Reset password', resetSuccess:'Password reset successful! You can now sign in.', forgotSuccess:'OTP sent. Check your email or server logs.' }
} as const;

export default function Login() {
  const router = useRouter();
  const [view, setView] = useState<View>('login');
  const [language, setLanguage] = useState<Language>('vi');
  const t = copy[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => { if (localStorage.getItem('token')) router.replace('/dashboard'); }, [router]);

  const finish = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
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
      setError(cause instanceof Error ? cause.message : view === 'login' ? t.loginError : t.registerError);
      setBusy(false);
    }
  };

  const submitForgot = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setNotice(t.forgotSuccess);
      setView('reset');
      setBusy(false);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : t.loginError);
      setBusy(false);
    }
  };

  const submitReset = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      setNotice(t.resetSuccess);
      setView('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setBusy(false);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : t.loginError);
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
        <div className="brand-copy"><ProductGuardMark tone="inverse"/><h1>{t.headline}</h1><p>{t.promise}</p><ul className="brand-points">{t.benefits.map(item=><li key={item}><span><Check size={17} strokeWidth={3}/></span>{item}</li>)}</ul></div>
        <small className="brand-foot">Guardian Vietnam · Product compliance platform</small>
      </section>
      <section className="auth-side">
        <div className="language" role="group" aria-label={t.language}>
          <button className={language==='vi'?'active':''} type="button" aria-pressed={language==='vi'} onClick={()=>setLanguage('vi')}>VI</button>
          <button className={language==='en'?'active':''} type="button" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button>
        </div>
        <div className="auth-form-shell">
          <div className="mobile-brand"><ProductGuardMark/></div>
          {view!=='login'&&<button className="back" type="button" onClick={()=>{setView('login');setError('');setNotice('')}}><ArrowLeft size={17}/>{t.back}</button>}
          <header className="auth-head">
            <h2>{view==='login'?t.welcome:view==='register'?t.registerTitle:view==='forgot'?t.forgotTitle:t.resetTitle}</h2>
            <p>{view==='login'?t.loginIntro:view==='register'?t.registerIntro:view==='forgot'?t.forgotIntro:t.resetIntro}</p>
          </header>
          {notice&&<div className="error" role="status" style={{borderColor:'#bbf7d0',background:'#f0fdf4',color:'#15803d'}}>{notice}</div>}
          {error&&<div className="error" role="alert">{error}</div>}
          {view==='login'&&<form className="auth-form" onSubmit={submit}>
            <label className="field">{t.identifier}<span className="input"><Mail size={19}/><input type="text" autoComplete="email" placeholder={t.identifierPlaceholder} required value={email} onChange={event=>setEmail(event.target.value)}/></span></label>
            <label className="field">{t.password}<span className="input"><KeyRound size={19}/><input type={showPassword?'text':'password'} autoComplete="current-password" placeholder={t.passwordPlaceholder} required value={password} onChange={event=>setPassword(event.target.value)}/><button type="button" className="show-password" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?t.hide:t.show}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></span></label>
            <div className="options"><label className="remember"><input type="checkbox" defaultChecked/>{t.remember}</label><button type="button" className="text-button" onClick={()=>{setView('forgot');setError('');setNotice('')}}>{t.forgot}</button></div>
            <button className="submit" disabled={busy}>{busy&&<Loader2 className="spin" size={19}/>} {busy?t.loggingIn:t.login} {!busy&&<ArrowRight size={20}/>}</button>
          </form>}
          {view==='register'&&<form className="auth-form" onSubmit={submit}>
            <label className="field">{t.fullName}<span className="input"><UserRound size={19}/><input autoComplete="name" placeholder={t.fullNamePlaceholder} required value={fullName} onChange={event=>setFullName(event.target.value)}/></span></label>
            <label className="field">{t.email}<span className="input"><Mail size={19}/><input type="email" autoComplete="email" placeholder={t.emailPlaceholder} required value={email} onChange={event=>setEmail(event.target.value)}/></span></label>
            <label className="field">{t.password}<span className="input"><KeyRound size={19}/><input type={showPassword?'text':'password'} autoComplete="new-password" minLength={6} placeholder={t.newPasswordPlaceholder} required value={password} onChange={event=>setPassword(event.target.value)}/><button type="button" className="show-password" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?t.hide:t.show}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></span></label>
            <button className="submit" disabled={busy}>{busy&&<Loader2 className="spin" size={19}/>} {busy?t.registering:t.register} {!busy&&<ArrowRight size={20}/>}</button>
          </form>}
          {view==='forgot'&&<form className="auth-form" onSubmit={submitForgot}>
            <label className="field">{t.email}<span className="input"><Mail size={19}/><input type="email" autoComplete="email" placeholder={t.emailPlaceholder} required value={email} onChange={event=>setEmail(event.target.value)}/></span></label>
            <button className="submit" disabled={busy}>{busy&&<Loader2 className="spin" size={19}/>} {busy?t.forgotSending:t.forgotSend} {!busy&&<ArrowRight size={20}/>}</button>
          </form>}
          {view==='reset'&&<form className="auth-form" onSubmit={submitReset}>
            <label className="field">{t.email}<span className="input"><Mail size={19}/><input type="email" autoComplete="email" placeholder={t.emailPlaceholder} required value={email} onChange={event=>setEmail(event.target.value)}/></span></label>
            <label className="field">{t.otpLabel}<span className="input"><KeyRound size={19}/><input type="text" inputMode="numeric" maxLength={6} placeholder={t.otpPlaceholder} required value={otp} onChange={event=>setOtp(event.target.value)}/></span></label>
            <label className="field">{t.newPasswordLabel}<span className="input"><KeyRound size={19}/><input type={showPassword?'text':'password'} autoComplete="new-password" minLength={6} placeholder={t.newPasswordPlaceholder} required value={newPassword} onChange={event=>setNewPassword(event.target.value)}/><button type="button" className="show-password" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?t.hide:t.show}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></span></label>
            <button className="submit" disabled={busy}>{busy&&<Loader2 className="spin" size={19}/>} {busy?t.registering:t.resetButton} {!busy&&<ArrowRight size={20}/>}</button>
          </form>}
          {view==='login'&&<p className="switch">{t.noAccount} <button type="button" onClick={()=>{setView('register');setError('');setNotice('')}}>{t.registerLink}</button></p>}
        </div>
      </section>    </main>
  );
}