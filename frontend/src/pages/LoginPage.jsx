import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CustomCursor from '../components/CustomCursor';

/* ── Botanical line art ── */
const Botanical = () => (
  <svg viewBox="0 0 100 180" fill="none" style={{ width: 100, opacity: 0.18 }} aria-hidden="true">
    <path d="M50,160 C50,100 15,80 5,20" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M50,160 C50,100 85,80 95,20" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="20" cy="65" rx="16" ry="9" transform="rotate(-30 20 65)" fill="var(--primary-fixed)" opacity="0.6"/>
    <ellipse cx="80" cy="55" rx="14" ry="8" transform="rotate(25 80 55)" fill="var(--tertiary-fixed)" opacity="0.5"/>
    <ellipse cx="38" cy="40" rx="12" ry="7" transform="rotate(-15 38 40)" fill="var(--primary-fixed)" opacity="0.5"/>
    <ellipse cx="65" cy="35" rx="10" ry="6" transform="rotate(20 65 35)" fill="var(--secondary-fixed)" opacity="0.5"/>
    <circle cx="50" cy="160" r="4" fill="var(--secondary)" opacity="0.5"/>
  </svg>
);

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--background)', display: 'flex',
      alignItems: 'stretch', fontFamily: 'var(--font-sans)', color: 'var(--on-surface)',
    }}>
      <CustomCursor />

      {/* ── Left decorative panel ── */}
      <div style={{
        flex: '0 0 44%',
        background: 'var(--surface-container)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', gap: 32, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background monogram watermark */}
        <div style={{
          position: 'absolute', bottom: -20, right: -20,
          fontFamily: 'var(--font-serif)', fontSize: '14rem', fontWeight: 600,
          color: 'var(--surface-container-high)', lineHeight: 1, pointerEvents: 'none',
          userSelect: 'none', opacity: 0.5,
        }}>E</div>

        <Botanical />

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 16, letterSpacing: '0.15em' }}>
            PLATFORM UNDANGAN DIGITAL
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 500, lineHeight: 1.2, color: 'var(--on-surface)', fontStyle: 'italic',
          }}>
            Setiap Momen<br />Berhak Dirayakan<br />dengan Indah
          </h2>

          {/* Calligraphic rule */}
          <svg viewBox="0 0 240 16" fill="none" style={{ width: 180, opacity: 0.4, margin: '20px auto 0', display: 'block' }} aria-hidden="true">
            <path d="M0,8 C30,2 60,14 90,7 C120,1 150,13 180,6 C210,1 230,12 240,8" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Feature tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', zIndex: 1 }}>
          {['✉️ Amplop Interaktif', '🎉 RSVP Real-Time', '✍️ Kanvas Ucapan', '📺 Live Board'].map(tag => (
            <span key={tag} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              background: 'var(--surface-container-high)',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
              color: 'var(--on-surface-variant)',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '60px 10%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 48 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--on-surface)' }}>
            E-<em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>nvelope</em>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="headline-md" style={{ marginBottom: 8 }}>Masuk ke Akun Anda</h1>
          <p className="body-md" style={{ marginBottom: 36 }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 500, textDecoration: 'none' }}>
              Daftar gratis
            </Link>
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              background: 'var(--error-container)', color: 'var(--on-error-container)',
              marginBottom: 24, fontSize: 14, fontWeight: 500,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8, color: 'var(--outline)' }}>Alamat Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-underline"
                placeholder="nama@email.com"
                style={{ fontSize: 16 }}
              />
            </div>

            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8, color: 'var(--outline)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-underline"
                  placeholder="Minimal 6 karakter"
                  style={{ fontSize: 16, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: 4,
                  }}
                  aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary cursor-zone"
              style={{ justifyContent: 'center', width: '100%', padding: '15px', fontSize: 16, marginTop: 8 }}
            >
              {loading ? 'Masuk...' : <>Masuk ke Dashboard <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
            <span className="label-sm">atau lanjutkan sebagai tamu</span>
            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
          </div>

          <Link to="/" className="btn-ghost cursor-zone" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            Lihat Undangan Demo
          </Link>

          <p className="label-sm" style={{ textAlign: 'center', marginTop: 36, color: 'var(--outline)' }}>
            Dengan masuk, Anda menyetujui{' '}
            <span style={{ color: 'var(--secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Syarat & Ketentuan</span>
            {' '}E-nvelope.
          </p>
        </div>
      </div>
    </div>
  );
}
