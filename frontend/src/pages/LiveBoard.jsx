import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import MonogramBadge from '../components/MonogramBadge';

export default function LiveBoard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [wishes, setWishes]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const floatingRef  = useRef(null);
  const prevLengthRef = useRef(0);

  /* Initial load */
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`http://localhost:5000/api/invitations/${id}`);
        if (!r.ok) throw new Error('Acara tidak ditemukan.');
        const inv = await r.json();
        setInvitation(inv);

        const wr = await fetch(`http://localhost:5000/api/invitations/${id}/wishes`);
        if (wr.ok) {
          const wl = await wr.json();
          setWishes(wl);
          prevLengthRef.current = wl.length;
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  /* Poll for new wishes every 3s */
  useEffect(() => {
    if (!invitation) return;
    const iv = setInterval(async () => {
      try {
        const wr = await fetch(`http://localhost:5000/api/invitations/${id}/wishes`);
        if (wr.ok) {
          const wl = await wr.json();
          if (wl.length > prevLengthRef.current) {
            for (let i = prevLengthRef.current; i < wl.length; i++) {
              spawn(wl[i].emoji || '✨');
            }
            prevLengthRef.current = wl.length;
          }
          setWishes(wl);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(iv);
  }, [id, invitation]);

  /* Ambient emoji background */
  useEffect(() => {
    if (!invitation) return;
    const emojis = ['🎉', '❤️', '✨', '🥂', '🕊️', '🙏', '🌿'];
    const iv = setInterval(() => spawn(emojis[Math.floor(Math.random() * emojis.length)]), 2800);
    return () => clearInterval(iv);
  }, [invitation]);

  const spawn = (char) => {
    if (!floatingRef.current) return;
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.innerText = char;
    el.style.left = `${5 + Math.random() * 90}%`;
    el.style.fontSize = `${1.5 + Math.random() * 2}rem`;
    el.style.animationDuration = `${4 + Math.random() * 3}s`;
    floatingRef.current.appendChild(el);
    setTimeout(() => el.remove(), 7500);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <p className="body-md">Menyiapkan Layar Proyektor...</p>
    </div>
  );
  if (error || !invitation) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', flexDirection: 'column', gap: 12 }}>
      <p className="headline-sm" style={{ color: 'var(--error)' }}>Gagal Memuat Live Board</p>
      <p className="body-md">{error}</p>
    </div>
  );

  const { title, theme } = invitation;
  const accentColor = theme === 'gold' ? '#b8941a' : theme === 'batik' ? '#7d562d' : theme === 'neon' ? '#56642b' : '#5c6145';
  const invBg = theme === 'gold' ? '#faf6ed' : theme === 'batik' ? '#fdf6ee' : theme === 'neon' ? '#f8faf4' : '#f8f5f0';

  return (
    <div style={{
      minHeight: '100vh', background: invBg, color: 'var(--on-surface)',
      fontFamily: 'var(--font-sans)', position: 'relative',
      padding: '40px 4% 60px', display: 'flex', flexDirection: 'column', overflowX: 'hidden',
    }}>
      <div ref={floatingRef} className="floating-emoji-container" />

      {/* Exit button — faded, shows on hover */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'absolute', top: 20, left: 20,
          background: 'rgba(255,255,255,0.6)', border: '1px solid var(--outline-variant)',
          padding: '8px 16px', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          opacity: 0.25, transition: 'opacity 0.25s', zIndex: 99,
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '1'}
        onMouseOut={e => e.currentTarget.style.opacity = '0.25'}
      >
        <ChevronLeft size={14} /> Keluar Presentasi
      </button>

      {/* Board header */}
      <div style={{ textAlign: 'center', zIndex: 10, marginBottom: 48 }}>
        <MonogramBadge initials={invitation.hostName.slice(0, 3)} size="sm" />
        <p className="label-sm" style={{ color: accentColor, marginTop: 16, marginBottom: 12, letterSpacing: '0.15em' }}>
          ✦ LIVE WISHES BOARD ✦
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 500, lineHeight: 1.1, fontStyle: 'italic',
          color: 'var(--on-surface)'
        }}>
          {title}
        </h1>

        {/* Calligraphic rule */}
        <svg viewBox="0 0 300 16" fill="none" style={{ width: 220, opacity: 0.35, margin: '16px auto 0', display: 'block' }} aria-hidden="true">
          <path d="M0,8 C30,2 60,14 90,7 C120,1 150,13 180,6 C210,1 240,13 270,7 C285,4 295,10 300,8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        </svg>

        <p className="label-sm" style={{ marginTop: 16, color: 'var(--outline)' }}>
          Scan QR atau kunjungi link undangan untuk mengirim ucapan
        </p>
      </div>

      {/* Wish wall */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24, zIndex: 10, flex: 1,
      }}>
        {wishes.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: 260,
            color: 'var(--outline)',
          }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>✦</span>
            <p className="headline-sm" style={{ fontStyle: 'italic' }}>Menunggu ucapan pertama dari tamu...</p>
          </div>
        ) : wishes.map((w, i) => (
          <div
            key={w.id}
            className="card animate-pop-in"
            style={{
              padding: '28px 24px',
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--shadow-md)',
              transform: i % 3 === 0 ? 'rotate(-0.5deg)' : i % 3 === 1 ? 'rotate(0.5deg)' : 'rotate(0deg)',
              display: 'flex', flexDirection: 'column', gap: 12,
              maxHeight: 260, overflow: 'hidden',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="label-md" style={{ color: accentColor, fontSize: 15 }}>
                {w.guestName} <span style={{ fontSize: 20 }}>{w.emoji}</span>
              </span>
              <span className="label-sm">
                {new Date(w.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--on-surface)' }}>
              "{w.message}"
            </p>
            {w.signature && (
              <div style={{ marginTop: 4, padding: '6px 10px', background: 'var(--surface-container)', borderRadius: 'var(--radius)', display: 'inline-flex' }}>
                <img src={w.signature} alt="sig" style={{ maxHeight: 40, filter: 'sepia(0.3) brightness(0.85)', display: 'block' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes popIn { 0%{opacity:0;transform:scale(0.85) translateY(16px)}100%{opacity:1;transform:scale(1) translateY(0)} }
        .animate-pop-in { animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
      `}</style>
    </div>
  );
}
