import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Check, Heart, Clock, ExternalLink, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import Envelope from '../components/Envelope';
import MusicPlayer from '../components/MusicPlayer';
import SignaturePad from '../components/SignaturePad';
import RsvpChip from '../components/RsvpChip';
import MonogramBadge from '../components/MonogramBadge';
import DeckleEdge from '../components/DeckleEdge';
import CustomCursor from '../components/CustomCursor';

/* ── Calligraphic rule ── */
const CalliRule = ({ color = 'var(--secondary)', style = {} }) => (
  <svg viewBox="0 0 300 16" fill="none" style={{ width: '100%', maxWidth: 280, opacity: 0.4, ...style }} aria-hidden="true">
    <path d="M0,8 C30,2 60,14 90,7 C120,1 150,13 180,6 C210,1 240,13 270,7 C285,4 295,10 300,8"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function InvitationView() {
  const { id } = useParams();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [playMusic, setPlayMusic]   = useState(false);
  const [countdown, setCountdown]   = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  /* RSVP */
  const [rsvpName, setRsvpName]     = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('attending');
  const [rsvpCount, setRsvpCount]   = useState(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  /* Wishes */
  const [wishName, setWishName]       = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishEmoji, setWishEmoji]     = useState('🎉');
  const [wishSignature, setWishSignature] = useState('');
  const [wishes, setWishes]           = useState([]);

  const floatingRef = useRef(null);

  /* Fetch */
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`http://localhost:5000/api/invitations/${id}`);
        if (!r.ok) throw new Error('Undangan tidak ditemukan.');
        setInvitation(await r.json());
        const wr = await fetch(`http://localhost:5000/api/invitations/${id}/wishes`);
        if (wr.ok) setWishes((await wr.json()).reverse());
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  /* Countdown */
  useEffect(() => {
    if (!invitation?.details?.date) return;
    const target = new Date(invitation.details.date + 'T09:00:00').getTime();
    const iv = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { clearInterval(iv); return; }
      setCountdown({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [invitation]);

  const handleOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => {
      setPlayMusic(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.75 } });
    }, 600);
  };

  const handleRsvp = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`http://localhost:5000/api/invitations/${id}/rsvps`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: rsvpName, status: rsvpStatus, guestCount: rsvpCount }),
      });
      if (r.ok) {
        setRsvpSubmitted(true);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    } catch { alert('Gagal mengirim RSVP.'); }
  };

  const handleWish = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`http://localhost:5000/api/invitations/${id}/wishes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: wishName, message: wishMessage, emoji: wishEmoji, signature: wishSignature }),
      });
      if (r.ok) {
        const nw = await r.json();
        setWishes([nw, ...wishes]);
        spawnEmoji(wishEmoji);
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.9 } });
        setWishName(''); setWishMessage(''); setWishSignature('');
      }
    } catch { alert('Gagal mengirim ucapan.'); }
  };

  const spawnEmoji = (char) => {
    if (!floatingRef.current) return;
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.className = 'floating-emoji';
      el.innerText = char;
      el.style.left = `${10 + Math.random() * 80}%`;
      el.style.animationDelay = `${Math.random() * 0.4}s`;
      floatingRef.current.appendChild(el);
      setTimeout(() => el.remove(), 5500);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <p className="body-md">Memuat Undangan...</p>
    </div>
  );

  if (error || !invitation) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: 24 }}>
      <h2 className="headline-sm" style={{ color: 'var(--error)', marginBottom: 8 }}>Undangan Tidak Tersedia</h2>
      <p className="body-md">{error}</p>
    </div>
  );

  const { theme, eventType, hostName, title: pageTitle, musicUrl, details, status } = invitation;
  const accentColor = theme === 'gold' ? '#b8941a' : theme === 'batik' ? '#7d562d' : theme === 'neon' ? '#56642b' : '#5c6145';
  const invBg = theme === 'gold' ? '#faf6ed' : theme === 'batik' ? '#fdf6ee' : theme === 'neon' ? '#f8faf4' : '#f8f5f0';

  /* Google Calendar link */
  const calendarLink = () => {
    const d = details.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(pageTitle)}&dates=${d}T090000Z/${d}T170000Z&location=${encodeURIComponent(details.locationName)}`;
  };

  /* Derive monogram */
  const getMonogram = () => {
    const parts = hostName.split(/[\s&]+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}&${parts[parts.length - 1][0]}`.toUpperCase();
    return hostName.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ minHeight: '100vh', background: invBg, color: 'var(--on-surface)', fontFamily: 'var(--font-sans)', overflowX: 'hidden', position: 'relative' }}>
      <CustomCursor />
      <div ref={floatingRef} className="floating-emoji-container" />
      <MusicPlayer musicUrl={musicUrl} triggerPlay={playMusic} />

      {/* Envelope overlay */}
      {!envelopeOpen && <Envelope onOpen={handleOpen} hostName={hostName} eventType={eventType} />}

      {/* Main invitation content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 120px', animation: envelopeOpen ? 'fadeUpIn 0.8s ease' : 'none' }}>

        {/* ── HERO SECTION ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <MonogramBadge initials={getMonogram()} size="md" />
          <p className="label-sm" style={{ color: accentColor, marginTop: 16, marginBottom: 12 }}>
            {eventType === 'wedding' ? 'UNDANGAN PERNIKAHAN' : eventType === 'birthday' ? 'UNDANGAN ULANG TAHUN' : 'TASYAKURAN KHITAN'}
          </p>

          {details.imageUrl && (
            <div style={{ margin: '24px 0', position: 'relative' }}>
              <img
                src={details.imageUrl}
                alt={hostName}
                className="squircle-alt"
                style={{ width: '100%', maxHeight: 380, objectFit: 'cover', filter: 'saturate(0.85) sepia(0.06)', display: 'block' }}
              />
            </div>
          )}

          {eventType === 'wedding' && (
            <div style={{ marginBottom: 24 }}>
              <h1 className="display-xl" style={{ fontStyle: 'italic' }}>{details.groomName}</h1>
              <p className="label-sm" style={{ color: 'var(--outline)', margin: '8px 0 16px' }}>{details.groomParent}</p>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: accentColor, lineHeight: 1 }}>&</div>
              <h1 className="display-xl" style={{ fontStyle: 'italic', marginTop: 12 }}>{details.brideName}</h1>
              <p className="label-sm" style={{ color: 'var(--outline)', marginTop: 8 }}>{details.brideParent}</p>
            </div>
          )}
          {eventType === 'birthday' && (
            <div style={{ marginBottom: 24 }}>
              <h1 className="display-xl">{details.celebrantName}</h1>
              <h2 className="headline-sm" style={{ color: accentColor, marginTop: 8 }}>Sweet {details.age} Birthday Party</h2>
            </div>
          )}
          {eventType === 'khitanan' && (
            <div style={{ marginBottom: 24 }}>
              <h1 className="display-xl">{details.celebrantName}</h1>
              <p className="body-md" style={{ marginTop: 8 }}>{details.parentNames}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <CalliRule />
          </div>

          {details.quote && (
            <div style={{ margin: '32px auto', maxWidth: 500 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--on-surface-variant)' }}>
                "{details.quote}"
              </p>
              {details.quoteSource && (
                <p className="label-sm" style={{ color: accentColor, marginTop: 12 }}>— {details.quoteSource}</p>
              )}
            </div>
          )}
        </div>

        <DeckleEdge color={`${invBg}00`} />

        {/* ── COUNTDOWN ── */}
        <div style={{ textAlign: 'center', padding: '48px 0', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-xl)', marginBottom: 48, boxShadow: 'var(--shadow-sm)' }}>
          <p className="label-sm" style={{ color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Clock size={11} /> Momen Dimulai Dalam
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24 }}>
            {[['Hari', countdown.days], ['Jam', countdown.hours], ['Menit', countdown.minutes], ['Detik', countdown.seconds]].map(([lbl, val]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div className="display-lg" style={{ color: accentColor, lineHeight: 1 }}>{String(val).padStart(2,'0')}</div>
                <p className="label-sm" style={{ marginTop: 6 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DETAIL ACARA ── */}
        <div style={{ marginBottom: 48, padding: '40px 36px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="headline-sm" style={{ textAlign: 'center', marginBottom: 32 }}>Detail Acara</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} style={{ color: accentColor }} />
              </div>
              <div>
                <h4 className="label-md" style={{ marginBottom: 4 }}>Waktu & Tanggal</h4>
                <p className="body-md">{details.date}</p>
                <p className="body-md">{details.time}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} style={{ color: accentColor }} />
              </div>
              <div>
                <h4 className="label-md" style={{ marginBottom: 4 }}>Tempat Pelaksanaan</h4>
                <p className="body-md">{details.locationName}</p>
              </div>
            </div>
          </div>

          {details.mapEmbedUrl && (
            <div style={{ marginTop: 28, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <iframe title="Lokasi" src={details.mapEmbedUrl} width="100%" height="240" style={{ border: 0, display: 'block' }} loading="lazy" />
            </div>
          )}

          <a href={calendarLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost cursor-zone" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 24 }}>
            Simpan ke Kalender <ExternalLink size={14} />
          </a>
        </div>

        {/* ── RSVP ── */}
        <div style={{ marginBottom: 48, padding: '40px 36px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="headline-sm" style={{ textAlign: 'center', marginBottom: 8 }}>Konfirmasi Kehadiran</h2>
          <p className="body-md" style={{ textAlign: 'center', marginBottom: 28 }}>Bantu kami mempersiapkan kenyamanan acara untuk Anda.</p>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRsvp} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Nama Lengkap Anda</label>
                <input required value={rsvpName} onChange={e => setRsvpName(e.target.value)} className="input-filled" placeholder="Nama Anda..." />
              </div>

              <div>
                <label className="label-sm" style={{ display: 'block', marginBottom: 12 }}>Status Kehadiran</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <RsvpChip label="Hadir" icon="🎉" selected={rsvpStatus === 'attending'} onClick={() => setRsvpStatus('attending')} />
                  <RsvpChip label="Berhalangan" icon="😔" selected={rsvpStatus === 'not_attending'} onClick={() => setRsvpStatus('not_attending')} />
                  <RsvpChip label="Ragu-ragu" icon="🤔" selected={rsvpStatus === 'undecided'} onClick={() => setRsvpStatus('undecided')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 16, alignItems: 'flex-end' }}>
                <div>
                  <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Jumlah Tamu yang Hadir</label>
                  <input type="number" min="1" max="10" value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="input-filled" />
                </div>
                <button type="submit" className="btn-primary cursor-zone" style={{ width: '100%', justifyContent: 'center' }}>Kirim</button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(86,100,43,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Check size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="headline-sm" style={{ color: 'var(--primary)', marginBottom: 8 }}>Terima Kasih!</h3>
              <p className="body-md">Konfirmasi Anda telah kami terima dengan baik.</p>
              <button onClick={() => setRsvpSubmitted(false)} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--secondary)', fontFamily: 'var(--font-sans)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                Ubah RSVP
              </button>
            </div>
          )}
        </div>

        {/* ── WISH CANVAS ── */}
        <div style={{ marginBottom: 48, padding: '40px 36px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
          <h2 className="headline-sm" style={{ textAlign: 'center', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Heart size={20} style={{ color: accentColor }} /> Kanvas Ucapan
          </h2>
          <p className="body-md" style={{ textAlign: 'center', marginBottom: 28 }}>
            Kirim doa restu, emoji, dan tanda tangan digital Anda yang akan tampil di layar acara.
          </p>

          <form onSubmit={handleWish} style={{ display: 'flex', flexDirection: 'column', gap: 20, borderBottom: '1px solid var(--outline-variant)', paddingBottom: 36, marginBottom: 36 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div>
                <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Nama Pengirim</label>
                <input required value={wishName} onChange={e => setWishName(e.target.value)} className="input-filled" placeholder="Nama Anda..." />
              </div>
              <div>
                <label className="label-sm" style={{ display: 'block', marginBottom: 12 }}>Emoji</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['🎉','❤️','🙏','🥂','✨','🕊️','🎂'].map(e => (
                    <button key={e} type="button" onClick={() => setWishEmoji(e)}
                      style={{ fontSize: 20, background: wishEmoji === e ? 'var(--primary-fixed)' : 'var(--surface-container)', border: 'none', borderRadius: 'var(--radius)', padding: '4px 6px', cursor: 'pointer', transition: 'transform 0.2s', transform: wishEmoji === e ? 'scale(1.2)' : 'scale(1)' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Ucapan / Doa Restu</label>
              <textarea required rows="3" value={wishMessage} onChange={e => setWishMessage(e.target.value)} className="input-filled" placeholder="Tulis pesan hangat Anda..." style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
            </div>

            {status === 'premium' && (
              <div>
                <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Tanda Tangan / Doodle Digital</label>
                <SignaturePad onSave={setWishSignature} onClear={() => setWishSignature('')} />
              </div>
            )}

            <button type="submit" className="btn-primary cursor-zone" style={{ justifyContent: 'center' }}>
              Kirim Ucapan & Tanda Tangan
            </button>
          </form>

          {/* Wishes list */}
          <h3 className="label-sm" style={{ color: accentColor, marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            <MessageSquare size={12} /> Ucapan dari Tamu ({wishes.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
            {wishes.length === 0 ? (
              <p className="body-md" style={{ textAlign: 'center', padding: '20px 0', color: 'var(--outline)' }}>Belum ada ucapan. Jadilah yang pertama!</p>
            ) : wishes.map(w => (
              <div key={w.id} className={`card ${Math.random() > 0.5 ? 'card-rotate-neg' : 'card-rotate-pos'}`}
                style={{ padding: '16px 20px', background: 'var(--surface-container-low)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-md" style={{ color: accentColor }}>{w.guestName} <span style={{ fontSize: 16 }}>{w.emoji}</span></span>
                  <span className="label-sm">{new Date(w.timestamp).toLocaleDateString('id-ID')}</span>
                </div>
                <p className="body-md" style={{ fontSize: 14 }}>"{w.message}"</p>
                {w.signature && (
                  <img src={w.signature} alt={`Sig ${w.guestName}`} style={{ maxHeight: 40, alignSelf: 'flex-start', filter: 'sepia(0.3) brightness(0.9)', borderRadius: 4 }} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeUpIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
