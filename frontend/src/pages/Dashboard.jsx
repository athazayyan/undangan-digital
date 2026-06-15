import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, HelpCircle, Users, Share2, Clipboard, ExternalLink, Calendar, PlusCircle, Monitor } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import MonogramBadge from '../components/MonogramBadge';
import DeckleEdge from '../components/DeckleEdge';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const justCreatedId = location.state?.justCreatedId;

  const [invitations, setInvitations]       = useState([]);
  const [selectedId, setSelectedId]         = useState('');
  const [selectedInvitation, setSelectedInv] = useState(null);
  const [rsvps, setRsvps]                   = useState([]);
  const [wishes, setWishes]                 = useState([]);
  const [loading, setLoading]               = useState(true);
  const [copiedLink, setCopiedLink]         = useState(false);
  const [copiedMsg, setCopiedMsg]           = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/invitations')
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        setInvitations(list);
        if (list.length > 0) setSelectedId(justCreatedId || list[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [justCreatedId]);

  useEffect(() => {
    if (!selectedId) return;
    setSelectedInv(invitations.find(i => i.id === selectedId) || null);
    Promise.all([
      fetch(`http://localhost:5000/api/invitations/${selectedId}/rsvps`).then(r => r.ok ? r.json() : []),
      fetch(`http://localhost:5000/api/invitations/${selectedId}/wishes`).then(r => r.ok ? r.json() : []),
    ]).then(([r, w]) => { setRsvps(r); setWishes(w); }).catch(() => {});
  }, [selectedId, invitations]);

  const attending    = rsvps.filter(r => r.status === 'attending');
  const notAttending = rsvps.filter(r => r.status === 'not_attending');
  const undecided    = rsvps.filter(r => r.status === 'undecided');
  const totalPax     = attending.reduce((s, r) => s + r.guestCount, 0);
  const invLink      = `${window.location.protocol}//${window.location.host}/invitation/${selectedId}`;
  const waMsg        = `Halo, kami mengundang Anda ke acara *${selectedInvitation?.title || 'kami'}*. Detail dan RSVP di sini:\n\n${invLink}`;

  const copy = (text, setFlag) => { navigator.clipboard.writeText(text); setFlag(true); setTimeout(() => setFlag(false), 2000); };
  const sendWaReminder = (name) => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Halo *${name}*, ini pengingat ramah dari kami. Mohon konfirmasi kehadiran melalui: ${invLink}`)}`, '_blank');

  const labelCls = 'label-sm';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <p className="body-md">Memuat Dashboard...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--on-surface)' }}>
      <CustomCursor />

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 6%',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'rgba(255,248,245,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 500 }}>
          E-<em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>nvelope</em>
          <span className="label-sm" style={{ marginLeft: 12, color: 'var(--outline)' }}>Host Panel</span>
        </span>
        <Link to="/gallery" className="btn-primary cursor-zone" style={{ padding: '10px 20px', fontSize: 13 }}>
          <PlusCircle size={14} /> Undangan Baru
        </Link>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 68px)' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          background: 'var(--surface-container-low)',
          borderRight: '1px solid var(--outline-variant)',
          padding: '32px 20px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <p className={labelCls} style={{ color: 'var(--primary)' }}>Daftar Undangan</p>

          {invitations.length === 0 ? (
            <p className="body-md" style={{ fontSize: 13 }}>Belum ada undangan.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {invitations.map(inv => (
                <button key={inv.id} onClick={() => setSelectedId(inv.id)} style={{
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: 'none',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  background: selectedId === inv.id ? 'var(--primary-fixed)' : 'transparent',
                  color: selectedId === inv.id ? 'var(--on-primary-fixed)' : 'var(--on-surface)',
                  fontWeight: selectedId === inv.id ? 600 : 400,
                  transition: 'all 0.2s',
                }}>
                  <span className="label-sm" style={{ display: 'block', color: selectedId === inv.id ? 'var(--on-primary-fixed-variant)' : 'var(--outline)', marginBottom: 3, textTransform: 'capitalize' }}>
                    {inv.eventType} {inv.id === justCreatedId && '✦ Baru'}
                  </span>
                  {inv.hostName}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ padding: '40px 5%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 36 }}>

          {selectedInvitation ? (
            <>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <p className={labelCls} style={{ color: 'var(--primary)', marginBottom: 8 }}>Undangan Aktif</p>
                  <h1 className="headline-md" style={{ fontStyle: 'italic' }}>{selectedInvitation.title}</h1>
                  <p className="body-md" style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span><Calendar size={13} style={{ marginRight: 4 }} />{selectedInvitation.details.date}</span>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12, background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)', padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                      {selectedInvitation.theme}
                    </span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <a href={invLink} target="_blank" rel="noreferrer" className="btn-ghost cursor-zone" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Lihat Undangan <ExternalLink size={13} />
                  </a>
                  <Link to={`/live-board/${selectedId}`} target="_blank" className="btn-primary cursor-zone" style={{ padding: '8px 16px', fontSize: 13, background: 'var(--secondary)' }}>
                    <Monitor size={13} /> Live Board
                  </Link>
                </div>
              </div>

              {/* Share row */}
              <div style={{ padding: '20px 24px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <p className={labelCls} style={{ marginBottom: 8 }}>Tautan Undangan</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input readOnly value={invLink} className="input-filled" style={{ flex: 1, fontSize: 13, padding: '8px 12px' }} />
                    <button onClick={() => copy(invLink, setCopiedLink)} className="btn-primary cursor-zone" style={{ padding: '8px 16px', fontSize: 13 }}>
                      <Clipboard size={13} /> {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p className={labelCls} style={{ marginBottom: 8 }}>Template WA Blast</p>
                  <button onClick={() => copy(waMsg, setCopiedMsg)} className="btn-ghost cursor-zone" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                    <Share2 size={13} /> {copiedMsg ? 'Tersalin!' : 'Salin Pesan WA'}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { icon: <Users size={20} />, label: 'Total Respon', val: rsvps.length, sub: '', color: 'var(--primary)' },
                  { icon: <CheckCircle2 size={20} />, label: 'Hadir', val: attending.length, sub: `${totalPax} pax`, color: '#56642b' },
                  { icon: <XCircle size={20} />, label: 'Berhalangan', val: notAttending.length, sub: '', color: 'var(--error)' },
                  { icon: <HelpCircle size={20} />, label: 'Belum Pasti', val: undecided.length, sub: '', color: 'var(--secondary)' },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ padding: '24px 20px', textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                    <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{s.icon}</div>
                    <p className={labelCls}>{s.label}</p>
                    <div className="display-lg" style={{ fontSize: 32, lineHeight: 1, marginTop: 8, color: s.color }}>{s.val}</div>
                    {s.sub && <p className="label-sm" style={{ marginTop: 4 }}>{s.sub}</p>}
                  </div>
                ))}
              </div>

              <DeckleEdge color="var(--surface-container)" />

              {/* RSVP Table */}
              <div className="card" style={{ padding: '28px 24px' }}>
                <h2 className="headline-sm" style={{ marginBottom: 20 }}>Daftar Kehadiran Tamu</h2>
                {rsvps.length === 0 ? (
                  <p className="body-md" style={{ padding: '20px 0', color: 'var(--outline)', textAlign: 'center' }}>Belum ada respon RSVP.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                          {['Nama Tamu', 'Status', 'Jumlah', 'Waktu', 'Aksi'].map(h => (
                            <th key={h} className="label-sm" style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.map(r => (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--surface-container)' }}>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{r.guestName}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                                background: r.status === 'attending' ? 'rgba(86,100,43,0.12)' : r.status === 'not_attending' ? 'rgba(186,26,26,0.1)' : 'rgba(125,86,45,0.1)',
                                color: r.status === 'attending' ? 'var(--primary)' : r.status === 'not_attending' ? 'var(--error)' : 'var(--secondary)',
                              }}>
                                {r.status === 'attending' ? 'Hadir' : r.status === 'not_attending' ? 'Absen' : 'Ragu'}
                              </span>
                            </td>
                            <td className="body-md" style={{ padding: '12px' }}>{r.guestCount} orang</td>
                            <td className="label-sm" style={{ padding: '12px' }}>{new Date(r.timestamp).toLocaleDateString('id-ID')}</td>
                            <td style={{ padding: '12px' }}>
                              {r.status !== 'attending' && (
                                <button onClick={() => sendWaReminder(r.guestName)} className="btn-ghost cursor-zone" style={{ padding: '4px 12px', fontSize: 12 }}>
                                  Reminder WA
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Wishes preview */}
              <div className="card" style={{ padding: '28px 24px' }}>
                <h2 className="headline-sm" style={{ marginBottom: 20 }}>Ucapan Tamu ({wishes.length})</h2>
                {wishes.length === 0 ? (
                  <p className="body-md" style={{ color: 'var(--outline)', textAlign: 'center', padding: '20px 0' }}>Belum ada ucapan.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {wishes.slice(0, 6).map((w, i) => (
                      <div key={w.id} className="card" style={{ padding: '16px 20px', transform: i % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="label-md" style={{ color: 'var(--secondary)' }}>{w.guestName} {w.emoji}</span>
                          <span className="label-sm">{new Date(w.timestamp).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="body-md" style={{ fontSize: 13, fontStyle: 'italic' }}>"{w.message}"</p>
                        {w.signature && <img src={w.signature} alt="sig" style={{ maxHeight: 24, marginTop: 8, filter: 'sepia(0.3)' }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <p className="headline-sm" style={{ color: 'var(--outline)' }}>Pilih atau buat undangan untuk melihat data</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
