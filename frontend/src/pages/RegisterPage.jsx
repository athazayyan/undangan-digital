import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CustomCursor from '../components/CustomCursor';

const Botanical = () => (
  <svg viewBox="0 0 100 180" fill="none" style={{ width: 90, opacity: 0.18 }} aria-hidden="true">
    <path d="M50,160 C50,100 15,80 5,20" stroke="var(--secondary)" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M50,160 C50,100 85,80 95,20" stroke="var(--secondary)" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="20" cy="65" rx="14" ry="8" transform="rotate(-30 20 65)" fill="var(--secondary-fixed)" opacity="0.6"/>
    <ellipse cx="80" cy="55" rx="12" ry="7" transform="rotate(25 80 55)" fill="var(--primary-fixed)" opacity="0.5"/>
    <ellipse cx="40" cy="38" rx="10" ry="6" transform="rotate(-15 40 38)" fill="var(--secondary-fixed)" opacity="0.5"/>
    <circle cx="50" cy="160" r="4" fill="var(--primary)" opacity="0.5"/>
  </svg>
);

/* Password strength indicator */
function StrengthBar({ password }) {
  const len = password.length;
  const strength = len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : 3;
  const colors = ['transparent', '#ba1a1a', '#b8941a', '#56642b'];
  const labels = ['', 'Lemah', 'Sedang', 'Kuat'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= strength ? colors[strength] : 'var(--outline-variant)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {password && <span className="label-sm" style={{ color: colors[strength] }}>{labels[strength]}</span>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate    = useNavigate();
  const { register } = useAuth();

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPw) { setError('Password dan konfirmasi tidak cocok.'); return; }
    if (password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Buat undangan pernikahan, ulang tahun, khitanan',
    'RSVP tamu real-time & notifikasi otomatis',
    'Kanvas ucapan & tanda tangan digital',
    'Live Board proyektor layar acara',
    'Dasbor analitik kehadiran',
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--background)', display: 'flex',
      alignItems: 'stretch', fontFamily: 'var(--font-sans)', color: 'var(--on-surface)',
    }}>
      <CustomCursor />

      {/* ── Right decorative panel (flipped) ── */}
      <div style={{
        flex: '0 0 44%', order: 2,
        background: 'var(--inverse-surface)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', gap: 36, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background monogram watermark */}
        <div style={{
          position: 'absolute', bottom: -20, left: -20,
          fontFamily: 'var(--font-serif)', fontSize: '14rem', fontWeight: 600,
          color: 'rgba(255,255,255,0.04)', lineHeight: 1, pointerEvents: 'none',
          userSelect: 'none',
        }}>E</div>

        <Botanical />

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <p className="label-sm" style={{ color: 'var(--inverse-primary)', marginBottom: 16, letterSpacing: '0.15em' }}>
            BERGABUNG SEKARANG
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 2.8vw, 36px)',
            fontWeight: 500, lineHeight: 1.25, color: 'var(--inverse-on-surface)', fontStyle: 'italic',
          }}>
            Buat Undangan<br />Impian Anda<br />Hari Ini
          </h2>
          <svg viewBox="0 0 240 16" fill="none" style={{ width: 160, opacity: 0.3, margin: '18px auto 0', display: 'block' }} aria-hidden="true">
            <path d="M0,8 C30,2 60,14 90,7 C120,1 150,13 180,6 C210,1 230,12 240,8" stroke="var(--inverse-primary)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Benefit list */}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 1, width: '100%', maxWidth: 280 }}>
          {benefits.map(b => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                background: 'rgba(189,206,137,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={11} style={{ color: 'var(--inverse-primary)' }} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--inverse-on-surface)', lineHeight: 1.5 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Left form panel ── */}
      <div style={{
        flex: 1, order: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '60px 10%',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--on-surface)' }}>
            E-<em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>nvelope</em>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="headline-md" style={{ marginBottom: 8 }}>Buat Akun Baru</h1>
          <p className="body-md" style={{ marginBottom: 32 }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 500, textDecoration: 'none' }}>Masuk</Link>
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              background: 'var(--error-container)', color: 'var(--on-error-container)',
              marginBottom: 20, fontSize: 14, fontWeight: 500,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8, color: 'var(--outline)' }}>Nama Lengkap</label>
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-underline"
                placeholder="Nama Anda"
                style={{ fontSize: 16 }}
              />
            </div>

            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8, color: 'var(--outline)' }}>Alamat Email</label>
              <input
                id="reg-email"
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
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
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
              <div style={{ marginTop: 8 }}>
                <StrengthBar password={password} />
              </div>
            </div>

            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8, color: 'var(--outline)' }}>Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  className="input-underline"
                  placeholder="Ulangi password"
                  style={{
                    fontSize: 16,
                    borderBottomColor: confirmPw && confirmPw !== password ? 'var(--error)' : undefined,
                  }}
                />
                {confirmPw && confirmPw === password && (
                  <Check size={16} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                )}
              </div>
            </div>

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="btn-primary cursor-zone"
              style={{ justifyContent: 'center', width: '100%', padding: '15px', fontSize: 16, marginTop: 4 }}
            >
              {loading ? 'Membuat Akun...' : <>Daftar & Mulai Buat Undangan <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="label-sm" style={{ textAlign: 'center', marginTop: 28, color: 'var(--outline)' }}>
            Gratis · Tidak perlu kartu kredit · Bisa langsung digunakan
          </p>
        </div>
      </div>
    </div>
  );
}
