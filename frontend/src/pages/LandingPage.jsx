import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import DeckleEdge from '../components/DeckleEdge';
import MonogramBadge from '../components/MonogramBadge';

/* ── Inline SVG botanical decoration ── */
const Botanical = ({ style }) => (
  <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
    <path d="M60,180 C60,120 20,100 10,40" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M60,180 C60,120 100,100 110,40" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="30" cy="80" rx="18" ry="10" transform="rotate(-30 30 80)" fill="var(--primary-fixed)" opacity="0.5"/>
    <ellipse cx="90" cy="70" rx="16" ry="9" transform="rotate(25 90 70)" fill="var(--tertiary-fixed)" opacity="0.5"/>
    <ellipse cx="45" cy="50" rx="14" ry="8" transform="rotate(-15 45 50)" fill="var(--primary-fixed)" opacity="0.4"/>
    <ellipse cx="75" cy="45" rx="12" ry="7" transform="rotate(20 75 45)" fill="var(--secondary-fixed)" opacity="0.4"/>
    <circle cx="60" cy="180" r="4" fill="var(--secondary)" opacity="0.6"/>
  </svg>
);

/* ── Calligraphic variable-stroke rule ── */
const CalliRule = () => (
  <svg viewBox="0 0 300 16" fill="none" style={{ width: '100%', maxWidth: 300, opacity: 0.4 }} aria-hidden="true">
    <path d="M0,8 C30,2 60,14 90,7 C120,1 150,13 180,6 C210,1 240,13 270,7 C285,4 295,10 300,8"
      stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M60,8 C90,5 110,11 140,8" stroke="var(--primary)" strokeWidth="0.75" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const heroRef = useRef(null);

  const features = [
    {
      icon: '✉️',
      title: 'Animasi Pembukaan Amplop',
      body: 'Tamu membuka segel lilin digital yang muncul di layar penuh — menciptakan kesan emosional pertama yang tak terlupakan.',
    },
    {
      icon: '✅',
      title: 'RSVP Real-Time',
      body: 'Konfirmasi kehadiran tamu secara instan. Rekap otomatis langsung masuk ke dashboard host Anda.',
    },
    {
      icon: '✍️',
      title: 'Kanvas Ucapan & Tanda Tangan',
      body: 'Tamu mengirim pesan doa restu, memilih emoji, dan menggambar tanda tangan digital yang tampil di layar panggung.',
    },
  ];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--on-surface)', overflowX: 'hidden' }}>
      <CustomCursor />

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 6%',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'rgba(255,248,245,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>
          E-<em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>nvelope</em>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/gallery" className="label-md" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Templates</Link>
          <Link to="/dashboard" className="label-md" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/gallery" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
            Buat Undangan
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          padding: 'var(--space-section-lg) 6% var(--space-section-sm) 6%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
          position: 'relative',
          minHeight: '80vh',
        }}
      >
        {/* Left — text column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <p className="label-sm" style={{ color: 'var(--primary)' }}>Platform Undangan Digital Interaktif</p>

          <h1 className="display-xl" style={{ maxWidth: 520 }}>
            Setiap Undangan<br />Adalah Sebuah <em style={{ fontStyle: 'italic', color: 'var(--secondary)' }}>Cerita</em>
          </h1>

          <CalliRule />

          <p className="body-lg" style={{ maxWidth: 420 }}>
            E-nvelope menghadirkan pengalaman undangan digital yang hangat, modern, dan berkesan — sebuah segel lilin yang menunggu untuk dibuka.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
            <Link to="/gallery" className="btn-primary cursor-zone">
              Mulai Buat Undangan <ArrowRight size={16} />
            </Link>
            <button
              className="btn-ghost cursor-zone"
              onClick={() => setDemoOpen(!demoOpen)}
            >
              {demoOpen ? 'Tutup Demo' : 'Lihat Demo'}
            </button>
          </div>

          {/* Social proof micro-label */}
          <p className="label-sm" style={{ color: 'var(--outline)', marginTop: 8 }}>
            ✦ &nbsp;Dipercaya untuk Pernikahan · Ulang Tahun · Khitanan
          </p>
        </div>

        {/* Right — empty breathing room + botanical decoration */}
        <div style={{ position: 'relative', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Botanical style={{ width: 140, opacity: 0.55 }} />

          {/* Demo envelope preview card */}
          {demoOpen && (
            <div
              className="card animate-fade-up"
              style={{
                position: 'absolute',
                left: '5%',
                top: '10%',
                width: '88%',
                padding: '40px 32px',
                textAlign: 'center',
                background: 'var(--surface-container-low)',
                transform: 'rotate(-0.5deg)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
              }}
            >
              <p className="label-sm" style={{ color: 'var(--primary)' }}>Preview Demo — Tema Gold</p>
              <MonogramBadge initials="A & I" size="md" />
              <h2 className="headline-md" style={{ fontStyle: 'italic' }}>Adi & Indah</h2>
              <CalliRule />
              <p className="body-md" style={{ maxWidth: 280 }}>
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
              </p>
              <p className="label-sm" style={{ color: 'var(--outline)' }}>— Ar-Rum: 21</p>
              <div style={{
                padding: '10px 28px', borderRadius: 'var(--radius-full)',
                background: 'var(--primary)', color: 'white', fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 500
              }}>
                18 Oktober 2026 · Gedung TMII
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── DECKLE TRANSITION ── */}
      <DeckleEdge color="var(--surface-container)" />

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--surface-container)', padding: 'var(--space-section-sm) 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 12 }}>Mengapa E-nvelope</p>
          <h2 className="headline-md">Fitur yang Membuat Momen<br/>Terasa Istimewa</h2>
        </div>

        <div className="grid-auto-cards">
          {features.map((f, i) => (
            <div
              key={i}
              className={`card ${i % 2 === 0 ? 'card-rotate-neg' : 'card-rotate-pos'}`}
              style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <span style={{ fontSize: 32 }}>{f.icon}</span>
              <h3 className="headline-sm">{f.title}</h3>
              <p className="body-md">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DECKLE TRANSITION ── */}
      <DeckleEdge flip color="var(--surface-container-low)" />

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--surface-container-low)', padding: 'var(--space-section-sm) 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 12 }}>Alur Penggunaan</p>
          <h2 className="headline-md">Empat Langkah Menuju<br/>Undangan Berkesan</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { n: '01', t: 'Pilih Template', d: 'Jelajahi galeri template berdasarkan kategori dan tema estetik acara Anda.' },
            { n: '02', t: 'Isi & Sesuaikan', d: 'Lengkapi detail acara, unggah foto, pilih musik latar, dan tema warna.' },
            { n: '03', t: 'Kirim ke Tamu', d: 'Bagikan tautan eksklusif melalui WhatsApp, Instagram, atau salin link langsung.' },
            { n: '04', t: 'Pantau RSVP', d: 'Rekap kehadiran tamu real-time di dashboard host, dengan fitur reminder otomatis.' },
          ].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 500,
                color: 'var(--primary-fixed)', lineHeight: 1
              }}>{step.n}</span>
              <h4 className="headline-sm" style={{ fontSize: 18 }}>{step.t}</h4>
              <p className="body-md" style={{ fontSize: 14 }}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DECKLE TRANSITION ── */}
      <DeckleEdge color="var(--surface-container)" />

      {/* ── PRICING ── */}
      <section style={{ background: 'var(--surface-container)', padding: 'var(--space-section-sm) 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 12 }}>Harga</p>
          <h2 className="headline-md">Pilih Paket yang Sesuai</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 800, margin: '0 auto' }}>
          {/* Free */}
          <div className="card" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p className="label-sm" style={{ color: 'var(--outline)', marginBottom: 8 }}>Paket</p>
              <h3 className="headline-sm">Free</h3>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 500, marginTop: 8, color: 'var(--on-surface)' }}>
                Rp 0
              </div>
              <p className="label-sm" style={{ marginTop: 4 }}>Selamanya gratis</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Template standar (2 pilihan)', 'RSVP hingga 50 tamu', 'Kanvas ucapan teks saja'].map(item => (
                <li key={item} className="body-md" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Check size={16} style={{ marginTop: 3, flexShrink: 0, color: 'var(--primary)' }} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/gallery?pack=free" className="btn-ghost" style={{ textAlign: 'center', justifyContent: 'center', marginTop: 'auto' }}>
              Mulai Gratis
            </Link>
          </div>

          {/* Premium */}
          <div className="card" style={{
            padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 20,
            background: 'var(--inverse-surface)', color: 'var(--inverse-on-surface)',
            transform: 'rotate(0.5deg)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div>
              <p className="label-sm" style={{ color: 'var(--inverse-primary)', marginBottom: 8 }}>Paling Populer</p>
              <h3 className="headline-sm" style={{ color: 'var(--inverse-on-surface)' }}>Premium</h3>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 500, marginTop: 8, color: 'var(--inverse-on-surface)' }}>
                Rp 149.000
              </div>
              <p className="label-sm" style={{ color: 'var(--inverse-primary)', marginTop: 4 }}>per acara</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Semua template eksklusif (Gold, Batik, Neon, Pastel)',
                'RSVP tamu tak terbatas',
                'Tanda tangan digital & kanvas doodle',
                'Musik latar & foto custom',
                'Live Board layar panggung',
                'WhatsApp reminder otomatis',
              ].map(item => (
                <li key={item} className="body-md" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: 'var(--inverse-on-surface)' }}>
                  <Check size={16} style={{ marginTop: 3, flexShrink: 0, color: 'var(--inverse-primary)' }} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/gallery?pack=premium" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', marginTop: 'auto', background: 'var(--primary-fixed-dim)', color: 'var(--on-primary-fixed)' }}>
              Pilih Premium
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: 'center',
        padding: '48px 6%',
        borderTop: '1px solid var(--outline-variant)',
        background: 'var(--surface-container-low)',
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--on-surface)', display: 'block', marginBottom: 12 }}>
          E-<em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>nvelope</em>
        </span>
        <CalliRule />
        <p className="label-sm" style={{ marginTop: 16, color: 'var(--outline)' }}>
          © {new Date().getFullYear()} E-nvelope · Platform Undangan Digital Interaktif · Dibuat dengan ✦ untuk momen spesial Anda
        </p>
      </footer>
    </div>
  );
}
