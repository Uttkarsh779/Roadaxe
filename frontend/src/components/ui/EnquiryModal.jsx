import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '';

/* ─── Inline styles ──────────────────────────────────────────────────────── */
const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px', animation: 'eq-fade-in 0.2s ease',
  },
  modal: {
    background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px',
    maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    animation: 'eq-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    scrollbarWidth: 'thin', border: '1px solid rgba(255,255,255,0.1)',
  },
  header: {
    background: '#1a1a2e',
    padding: '30px 30px 25px', borderRadius: '16px 16px 0 0', position: 'relative',
    textAlign: 'center',
  },
  headerTitle: { color: '#fff', margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' },
  headerSub: { color: 'rgba(255,255,255,0.6)', margin: '8px 0 0', fontSize: '14px', lineHeight: 1.5 },
  closeBtn: {
    position: 'absolute', top: '15px', right: '15px',
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
    width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer',
    fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },
  productBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px', padding: '6px 12px', marginTop: '15px',
    color: '#fff', fontSize: '13px', fontWeight: 600,
  },
  body: { padding: '30px' },
  stepDots: { display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' },
  dot: (active, done) => ({
    height: '6px', width: '40px', borderRadius: '3px', transition: 'all 0.3s',
    background: done ? '#22c55e' : active ? '#1a1a2e' : '#e5e7eb',
  }),
  label: { display: 'block', fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' },
  input: (err) => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '15px',
    border: `2px solid ${err ? '#ef4444' : '#e5e7eb'}`,
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
    background: '#fff', color: '#1a1a2e',
  }),
  inputReadonly: {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '15px',
    border: '2px solid #f3f4f6', background: '#f9fafb', color: '#6b7280',
    boxSizing: 'border-box', cursor: 'not-allowed',
  },
  errMsg: { color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: 500 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  btnPrimary: (disabled) => ({
    width: '100%', padding: '15px', borderRadius: '12px', fontSize: '16px',
    fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#9ca3af' : '#1a1a2e',
    color: '#fff', border: 'none', transition: 'all 0.2s', marginTop: '20px',
    boxShadow: disabled ? 'none' : '0 10px 15px -3px rgba(26,26,46,0.3)',
  }),
  btnOutline: {
    background: 'transparent', border: '2px solid #1a1a2e', color: '#1a1a2e',
    padding: '10px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer',
    fontWeight: 700, transition: 'all 0.2s',
  },
  otpWrap: { display: 'flex', gap: '12px', justifyContent: 'center', margin: '25px 0' },
  otpInput: {
    width: '50px', height: '60px', textAlign: 'center', fontSize: '24px', fontWeight: 800,
    borderRadius: '12px', border: '2px solid #e5e7eb', outline: 'none',
    transition: 'all 0.2s', background: '#fff', color: '#1a1a2e',
  },
  toast: (type) => ({
    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 10001,
    padding: '16px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
    background: type === 'success' ? '#1a1a2e' : '#ef4444',
    color: '#fff',
    animation: 'eq-fade-in 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px',
    minWidth: '300px', justifyContent: 'center',
  }),
  successWrap: { textAlign: 'center', padding: '10px 0' },
  successIcon: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: '#f0fdf4', color: '#22c55e', display: 'flex',
    alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '40px',
  },
};

const keyframes = `
@keyframes eq-fade-in { from { opacity:0 } to { opacity:1 } }
@keyframes eq-slide-up { from { opacity:0; transform:translateY(40px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
@keyframes eq-spin { to { transform:rotate(360deg) } }
`;

/* ─── Toast ──────────────────────────────────────────────────────────────── */
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, [onDone]);
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
  return <div style={S.toast(type)}>{icon} {msg}</div>;
};

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = () => (
  <span style={{ display:'inline-block', width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'eq-spin 0.7s linear infinite', marginRight:'8px', verticalAlign:'middle' }} />
);

/* ─── OTP Inputs ─────────────────────────────────────────────────────────── */
const OtpInputs = ({ value, onChange }) => {
  const refs = Array.from({ length: 6 }, () => useRef(null));
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handle = (i, e) => {
    const v = e.target.value.replace(/\D/, '').slice(-1);
    const next = [...digits]; next[i] = v;
    onChange(next.join(''));
    if (v && i < 5) refs[i + 1].current?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length) { onChange(paste.padEnd(6, '').slice(0, 6)); refs[Math.min(paste.length, 5)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div style={S.otpWrap}>
      {digits.map((d, i) => (
        <input
          key={i} ref={refs[i]} maxLength={1} value={d}
          onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
          style={{ ...S.otpInput, borderColor: d ? '#4a6cf7' : '#e5e7eb' }}
          inputMode="numeric" autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   EnquiryModal — Main Component
   Props: { product: { _id, name }, onClose: fn }
═══════════════════════════════════════════════════════════════════════════ */
const EnquiryModal = ({ product, onClose }) => {
  // Steps: 1=fill form, 2=verify OTP, 3=success
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', companyName: '', message: '' });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  /* ── Field validation ────────────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required.';
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) errs.phone = 'Valid phone number is required.';
    if (!form.message.trim()) errs.message = 'Please describe your requirement.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Step 1 → Send OTP ───────────────────────────────────────────────── */
  const handleSendOtp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/enquiry/send-otp`, { email: form.email });
      setStep(2);
      setCooldown(60);
      showToast('OTP sent to your email!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      showToast(msg, 'error');
    } finally { setLoading(false); }
  };

  /* ── Step 2 → Verify OTP ─────────────────────────────────────────────── */
  const handleVerifyOtp = async () => {
    if (otp.length < 6) { setOtpError('Please enter the complete 6-digit OTP.'); return; }
    setOtpError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/enquiry/verify-otp`, { email: form.email, otp });
      setEmailVerified(true);
      await handleSubmitEnquiry();
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(msg);
    } finally { setLoading(false); }
  };

  /* ── Submit enquiry ──────────────────────────────────────────────────── */
  const handleSubmitEnquiry = async () => {
    try {
      await axios.post(`${API_URL}/api/enquiry/submit`, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        message: form.message.trim(),
        productId: product?._id || null,
        productName: product?.name || 'General Enquiry',
      });
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      showToast(msg, 'error');
      setStep(1);
    }
  };

  /* ── Resend OTP ──────────────────────────────────────────────────────── */
  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setOtp('');
    setOtpError('');
    try {
      await axios.post(`${API_URL}/api/enquiry/send-otp`, { email: form.email });
      setCooldown(60);
      showToast('New OTP sent!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP.';
      showToast(msg, 'error');
    } finally { setLoading(false); }
  };

  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: '' })); };

  const stepLabel = step === 1 ? 'Fill Details' : step === 2 ? 'Verify Email' : 'Done';

  return (
    <>
      <style>{keyframes}</style>
      <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={S.modal}>

          {/* ── Header ── */}
          <div style={S.header}>
            <h2 style={S.headerTitle}>Enquire Now</h2>
            <p style={S.headerSub}>
              {step === 1 && 'Fill in your details and we\'ll get back to you.'}
              {step === 2 && 'We sent a 6-digit OTP to your email.'}
              {step === 3 && 'Enquiry submitted successfully!'}
            </p>
            {product?.name && (
              <div style={S.productBadge}>
                <span>📦</span> {product.name}
              </div>
            )}
            <button style={S.closeBtn} onClick={onClose} aria-label="Close">✕</button>
          </div>

          {/* ── Step progress ── */}
          {step < 3 && (
            <div style={{ padding: '14px 28px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>Step {step} of 2: <strong style={{ color: '#1a1a2e' }}>{stepLabel}</strong></span>
              </div>
              <div style={S.stepDots}>
                <div style={S.dot(step === 1, step > 1)} />
                <div style={S.dot(step === 2, step > 2)} />
              </div>
            </div>
          )}

          <div style={S.body}>

            {/* ═══ STEP 1: Form Fields ═══ */}
            {step === 1 && (
              <>
                <div style={S.row}>
                  <div>
                    <label style={S.label}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input id="enq-fullname" style={S.input(errors.fullName)} value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="John Doe" />
                    {errors.fullName && <p style={S.errMsg}>{errors.fullName}</p>}
                  </div>
                  <div>
                    <label style={S.label}>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                    <input id="enq-phone" style={S.input(errors.phone)} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+91 98765 43210" />
                    {errors.phone && <p style={S.errMsg}>{errors.phone}</p>}
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={S.label}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="enq-email" type="email" style={S.input(errors.email)} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@example.com" />
                  {errors.email && <p style={S.errMsg}>{errors.email}</p>}
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={S.label}>Company Name <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
                  <input id="enq-company" style={S.input(false)} value={form.companyName} onChange={e => setField('companyName', e.target.value)} placeholder="Your Company Pvt. Ltd." />
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={S.label}>Message / Requirement <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea id="enq-message" rows={4} style={{ ...S.input(errors.message), resize: 'vertical', fontFamily: 'inherit' }} value={form.message} onChange={e => setField('message', e.target.value)} placeholder="Describe your requirement, quantity needed, or any specific questions..." />
                  {errors.message && <p style={S.errMsg}>{errors.message}</p>}
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={S.label}>Product</label>
                  <input style={S.inputReadonly} value={product?.name || 'General Enquiry'} readOnly />
                </div>

                <button id="enq-send-otp-btn" style={S.btnPrimary(loading)} disabled={loading} onClick={handleSendOtp}>
                  {loading ? <><Spinner />Sending OTP...</> : '✉️  Verify Email & Continue'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
                  A 6-digit OTP will be sent to your email to verify your identity.
                </p>
              </>
            )}

            {/* ═══ STEP 2: OTP Verification ═══ */}
            {step === 2 && (
              <>
                <p style={{ color: '#555', fontSize: '14px', textAlign: 'center', marginBottom: '4px' }}>
                  Enter the OTP sent to <strong style={{ color: '#1a1a2e' }}>{form.email}</strong>
                </p>
                <OtpInputs value={otp} onChange={setOtp} />
                {otpError && <p style={{ ...S.errMsg, textAlign: 'center' }}>{otpError}</p>}

                <button id="enq-verify-otp-btn" style={S.btnPrimary(loading || otp.length < 6)} disabled={loading || otp.length < 6} onClick={handleVerifyOtp}>
                  {loading ? <><Spinner />Verifying & Submitting...</> : '🔒  Verify & Submit Enquiry'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '13px', cursor: 'pointer', padding: 0 }} onClick={() => { setStep(1); setOtp(''); setOtpError(''); }}>
                    ← Edit Details
                  </button>
                  <button style={{ background: 'none', border: 'none', fontSize: '13px', cursor: cooldown > 0 ? 'not-allowed' : 'pointer', color: cooldown > 0 ? '#9ca3af' : '#4a6cf7', padding: 0, fontWeight: 600 }} onClick={handleResend} disabled={cooldown > 0}>
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '14px' }}>
                  OTP expires in 5 minutes. Check your spam folder if not received.
                </p>
              </>
            )}

            {/* ═══ STEP 3: Success ═══ */}
            {step === 3 && (
              <div style={S.successWrap}>
                <div style={S.successIcon}>✅</div>
                <h3 style={{ color: '#1a1a2e', fontSize: '20px', margin: '0 0 10px' }}>Enquiry Submitted!</h3>
                <p style={{ color: '#555', lineHeight: 1.7, margin: '0 0 24px' }}>
                  Your enquiry has been submitted successfully.<br />
                  <strong>Our sales team will contact you shortly.</strong>
                </p>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px', textAlign: 'left', marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#15803d', fontWeight: 600 }}>📋 Enquiry Summary</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}><strong>Product:</strong> {product?.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#374151' }}><strong>Email:</strong> {form.email} ✓ Verified</p>
                </div>
                <button style={{ ...S.btnPrimary(false), marginTop: 0 }} onClick={onClose}>Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
};

export default EnquiryModal;
