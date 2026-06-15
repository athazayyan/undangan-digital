import React, { useState, useEffect, useRef } from 'react';
import MonogramBadge from './MonogramBadge';

/**
 * Envelope — Full-screen wax-seal intro screen.
 * On click/tap the wax seal, a clip-path animation collapses the overlay
 * to reveal the invitation content beneath.
 *
 * Props:
 *   onOpen    — callback fired when reveal completes
 *   hostName  — string displayed on the seal & inner card
 *   eventType — 'wedding' | 'birthday' | 'khitanan'
 */
function Envelope({ onOpen, hostName = '', eventType = 'wedding' }) {
  const [phase, setPhase] = useState('idle'); // idle | pressing | revealing | done
  const sealRef = useRef(null);

  // Derive a short monogram from hostName
  const getMonogram = () => {
    if (!hostName) return 'E';
    const parts = hostName.split(/[\s&+,]+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]} & ${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getEventLabel = () => {
    const labels = { wedding: 'Undangan Pernikahan', birthday: 'Undangan Ulang Tahun', khitanan: 'Tasyakuran Khitan' };
    return labels[eventType] || 'Undangan';
  };

  // Mouse parallax shimmer
  useEffect(() => {
    if (phase !== 'idle') return;
    const seal = sealRef.current;
    if (!seal) return;

    const onMove = (e) => {
      const rect = seal.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      seal.style.background = `radial-gradient(circle at ${50 + dx * 30}% ${50 + dy * 30}%, #a0b065 0%, #56642b 40%, #3e4c16 80%)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const handleSealClick = () => {
    if (phase !== 'idle') return;
    setPhase('pressing');
    setTimeout(() => {
      setPhase('revealing');
      setTimeout(() => {
        setPhase('done');
        onOpen && onOpen();
      }, 950);
    }, 150);
  };

  if (phase === 'done') return null;

  return (
    <div
      className={`envelope-screen ${phase === 'revealing' ? 'revealing' : ''}`}
      style={{ cursor: phase === 'idle' ? 'none' : 'default' }}
    >
      {/* Decorative corner botanical line-art */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', top: 24, left: 24, width: 80, opacity: 0.18, pointerEvents: 'none' }}
        viewBox="0 0 80 80" fill="none"
      >
        <path d="M4 76 Q4 4 76 4" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"/>
        <circle cx="10" cy="10" r="3" fill="var(--primary)" />
        <path d="M20 20 C25 10 35 15 30 25 C25 35 15 30 20 20Z" fill="var(--primary-fixed)" />
        <path d="M40 15 C45 5 55 10 50 20 C45 30 35 25 40 15Z" fill="var(--tertiary-fixed)" opacity="0.7"/>
      </svg>
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 24, right: 24, width: 80, opacity: 0.18, pointerEvents: 'none', transform: 'rotate(180deg)' }}
        viewBox="0 0 80 80" fill="none"
      >
        <path d="M4 76 Q4 4 76 4" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"/>
        <circle cx="10" cy="10" r="3" fill="var(--primary)" />
        <path d="M20 20 C25 10 35 15 30 25 C25 35 15 30 20 20Z" fill="var(--primary-fixed)" />
      </svg>

      {/* Monogram background watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.06,
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        <MonogramBadge initials={getMonogram()} size="lg" />
      </div>

      {/* Center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', padding: '0 24px' }}>

        {/* Event label */}
        <p className="label-sm" style={{ color: 'var(--outline)', letterSpacing: '0.15em' }}>
          {getEventLabel()}
        </p>

        {/* Host name */}
        <h1
          className="display-lg"
          style={{ maxWidth: 500, textAlign: 'center' }}
        >
          {hostName}
        </h1>

        {/* Wax Seal */}
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <div
            ref={sealRef}
            className="wax-seal cursor-zone"
            onClick={handleSealClick}
            style={{
              transform: phase === 'pressing' ? 'scale(0.93)' : 'scale(1)',
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            role="button"
            aria-label="Buka undangan"
          >
            <span className="wax-seal-text">
              {getMonogram()}
            </span>
          </div>
        </div>

        {/* CTA label */}
        <p className="label-sm" style={{ color: 'var(--outline)', letterSpacing: '0.12em' }}>
          Sentuh Segel untuk Membuka
        </p>

        {/* Decorative variable-weight botanical rule */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 12"
          style={{ width: 180, opacity: 0.35, marginTop: 8 }}
          fill="none"
        >
          <path
            d="M0,6 C20,2 40,10 60,5 C80,1 100,9 120,5 C140,1 160,10 180,5 C200,1 220,9 240,5"
            stroke="var(--secondary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default Envelope;
