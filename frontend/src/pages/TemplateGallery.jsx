import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Eye, ArrowRight } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import DeckleEdge from '../components/DeckleEdge';
import RsvpChip from '../components/RsvpChip';
import MonogramBadge from '../components/MonogramBadge';

const TEMPLATES = [
  {
    id: 'wedding-gold',
    name: 'Regal Gold',
    subtitle: 'Pernikahan Mewah',
    category: 'wedding',
    theme: 'gold',
    status: 'premium',
    desc: 'Nuansa emas metalik dan tipografi serif menghadirkan kesan pernikahan premium yang elegan dan abadi.',
    hostName: 'Adi & Indah',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'birthday-neon',
    name: 'Cyber Neon',
    subtitle: 'Pesta Ulang Tahun',
    category: 'birthday',
    theme: 'neon',
    status: 'free',
    desc: 'Kontras neon yang memukau dengan grid kota malam. Untuk perayaan yang penuh energi.',
    hostName: 'Rian 17th',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'khitanan-batik',
    name: 'Modern Batik',
    subtitle: 'Tasyakuran Khitan',
    category: 'khitanan',
    theme: 'batik',
    status: 'premium',
    desc: 'Motif batik keraton Jawa dipadukan dengan layout bersih kontemporer. Hangat dan berwibawa.',
    hostName: 'Tasyakuran Faiz',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'wedding-pastel',
    name: 'Sage Pastel',
    subtitle: 'Pernikahan Intim',
    category: 'wedding',
    theme: 'pastel',
    status: 'free',
    desc: 'Warna hijau sage kalem dan floral minimalis untuk pesta kebun yang tenang dan puitis.',
    hostName: 'Hafiz & Alya',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Semua Acara' },
  { id: 'wedding', label: '💍 Pernikahan' },
  { id: 'birthday', label: '🎂 Ulang Tahun' },
  { id: 'khitanan', label: '🕌 Khitanan' },
];

export default function TemplateGallery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewTpl, setPreviewTpl] = useState(null);

  const filtered = activeCategory === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCategory);

  const startCustomizing = (tpl) => {
    navigate(`/customize?template=${tpl.id}&theme=${tpl.theme}&category=${tpl.category}&hostName=${encodeURIComponent(tpl.hostName)}`);
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--on-surface)', paddingBottom: 80 }}>
      <CustomCursor />

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 6%',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'rgba(255,248,245,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <button
          onClick={() => navigate('/')}
          className="btn-ghost cursor-zone"
          style={{ padding: '8px 16px', fontSize: 14 }}
        >
          <ChevronLeft size={16} /> Beranda
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500 }}>
          Galeri Template
        </span>
      </nav>

      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', padding: '64px 6% 40px' }}>
        <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 12 }}>Koleksi Tema</p>
        <h1 className="display-lg">Pilih Template<br /><em style={{ fontStyle: 'italic', color: 'var(--secondary)' }}>Keren</em> Anda</h1>
        <p className="body-lg" style={{ maxWidth: 480, margin: '16px auto 0' }}>
          Setiap template dirancang sebagai karya editorial — bukan sekadar formulir digital.
        </p>
      </div>

      {/* ── CATEGORY FILTER CHIPS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '0 6% 40px' }}>
        {CATEGORIES.map(cat => (
          <RsvpChip
            key={cat.id}
            label={cat.label}
            selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>

      {/* ── GRID ── */}
      <div style={{ padding: '0 6%' }}>
        <div className="grid-auto-cards">
          {filtered.map((tpl, idx) => (
            <div
              key={tpl.id}
              className={`card ${idx % 2 === 0 ? 'card-rotate-neg' : 'card-rotate-pos'}`}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img src={tpl.imageUrl} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85) sepia(0.1)' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(30,27,24,0.5) 100%)'
                }} />
                {/* Badge */}
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  background: tpl.status === 'premium' ? 'var(--secondary)' : 'var(--surface-container-high)',
                  color: tpl.status === 'premium' ? 'white' : 'var(--on-surface)',
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                  {tpl.status}
                </span>
                {/* Name overlay */}
                <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1.2 }}>{tpl.name}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{tpl.subtitle}</p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p className="body-md" style={{ fontSize: 14 }}>{tpl.desc}</p>

                {/* Accent dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                    background: tpl.theme === 'gold' ? '#b8941a' : tpl.theme === 'neon' ? '#56642b' : tpl.theme === 'batik' ? '#7d562d' : '#5c6145',
                    boxShadow: '0 0 0 3px rgba(0,0,0,0.06)'
                  }} />
                  <span className="label-sm" style={{ color: 'var(--outline)', textTransform: 'capitalize' }}>Tema {tpl.theme}</span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                  <button
                    onClick={() => setPreviewTpl(tpl)}
                    className="btn-ghost cursor-zone"
                    style={{ flex: 1, padding: '10px 0', fontSize: 13, justifyContent: 'center' }}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => startCustomizing(tpl)}
                    className="btn-primary cursor-zone"
                    style={{ flex: 1.4, padding: '10px 0', fontSize: 13, justifyContent: 'center' }}
                  >
                    Gunakan <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {previewTpl && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(30,27,24,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={() => setPreviewTpl(null)}
        >
          <div
            className="card animate-pop-in"
            style={{ maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setPreviewTpl(null)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--outline)' }}>✕</button>
            <img src={previewTpl.imageUrl} alt={previewTpl.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-lg)', filter: 'saturate(0.85) sepia(0.1)' }} />
            <MonogramBadge initials={previewTpl.hostName.slice(0, 3)} size="sm" />
            <h2 className="headline-sm" style={{ fontStyle: 'italic' }}>{previewTpl.hostName}</h2>
            <p className="body-md" style={{ fontSize: 13 }}>{previewTpl.desc}</p>
            <button onClick={() => startCustomizing(previewTpl)} className="btn-primary cursor-zone" style={{ justifyContent: 'center' }}>
              Pilih & Edit Template Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
