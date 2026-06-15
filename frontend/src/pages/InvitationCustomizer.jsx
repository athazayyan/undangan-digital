import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Save, Calendar, MapPin, Image, Info } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';

export default function InvitationCustomizer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateId      = searchParams.get('template') || 'wedding-gold';
  const initialTheme    = searchParams.get('theme') || 'gold';
  const initialCategory = searchParams.get('category') || 'wedding';
  const initialHost     = searchParams.get('hostName') || 'Adi & Indah';

  const [hostName, setHostName]   = useState(initialHost);
  const [eventType, setEventType] = useState(initialCategory);
  const [theme, setTheme]         = useState(initialTheme);
  const [title, setTitle]         = useState(`Undangan ${initialHost}`);
  const [musicUrl, setMusicUrl]   = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [status]                  = useState('premium');

  const [groomName, setGroomName]       = useState('Aditya Pratama');
  const [groomParent, setGroomParent]   = useState('Putra dari Bpk. Budi & Ibu Siti');
  const [brideName, setBrideName]       = useState('Indah Lestari');
  const [brideParent, setBrideParent]   = useState('Putri dari Bpk. Joko & Ibu Aminah');
  const [celebrantName, setCelebrantName] = useState('Rian Hidayat');
  const [age, setAge]                   = useState('17');
  const [parentNames, setParentNames]   = useState('Putra dari Bpk. H. Ahmad & Ibu Laili');

  const [date, setDate]             = useState('2026-10-18');
  const [time, setTime]             = useState('09:00 — Selesai');
  const [locationName, setLocationName] = useState('Gedung Sasana Kriya, TMII, Jakarta');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7483863486127!2d106.89209567587126!3d-6.300683493688537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f2ea70000001%3A0xe543ef816a24be51!2sSasana%20Kriya!5e0!3m2!1sid!2sid!4v1718446900000!5m2!1sid!2sid');
  const [quote, setQuote]           = useState('Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...');
  const [quoteSource, setQuoteSource] = useState('Ar-Rum: 21');
  const [imageUrl, setImageUrl]     = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');

  const [previewTab, setPreviewTab] = useState('envelope');
  const [isSaving, setIsSaving]     = useState(false);

  useEffect(() => {
    if (eventType === 'birthday') {
      setMusicUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
      setImageUrl('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800');
      setQuote('Let\'s celebrate another year of pixels, music, and epic levels!');
      setQuoteSource('Rian');
      setDate('2026-07-25');
      setTime('19:00 — 22:00');
      setLocationName('Level Up Arcade Cafe, Bandung');
    } else if (eventType === 'khitanan') {
      setMusicUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3');
      setImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800');
      setQuote('Merupakan ungkapan syukur kami atas pelaksanaan syariat khitan putra kami tercinta...');
      setQuoteSource('Keluarga Bpk. H. Ahmad');
      setDate('2026-08-09');
      setTime('10:00 — 15:00');
      setLocationName('Kediaman Keluarga, Solo');
    } else {
      setMusicUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setImageUrl('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');
      setQuote('Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...');
      setQuoteSource('Ar-Rum: 21');
      setDate('2026-10-18');
      setTime('09:00 — Selesai');
      setLocationName('Gedung Sasana Kriya, TMII, Jakarta');
    }
  }, [eventType]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const details = { date, time, locationName, mapEmbedUrl, quote, quoteSource, imageUrl };
    if (eventType === 'wedding') { details.groomName = groomName; details.groomParent = groomParent; details.brideName = brideName; details.brideParent = brideParent; }
    if (eventType === 'birthday') { details.celebrantName = celebrantName; details.age = age; }
    if (eventType === 'khitanan') { details.celebrantName = celebrantName; details.parentNames = parentNames; }

    try {
      const res = await fetch('http://localhost:5000/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName, eventType, theme, title, musicUrl, details, status }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      navigate('/dashboard', { state: { justCreatedId: saved.id } });
    } catch {
      alert('Gagal menyimpan. Pastikan server Express (port 5000) sudah berjalan.');
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Field style helpers ── */
  const label = (text) => (
    <span className="label-sm" style={{ display: 'block', marginBottom: 6, color: 'var(--outline)' }}>{text}</span>
  );

  const accentColor = theme === 'gold' ? '#b8941a' : theme === 'batik' ? '#7d562d' : theme === 'neon' ? '#56642b' : '#5c6145';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--on-surface)', display: 'flex', flexDirection: 'column' }}>
      <CustomCursor />

      {/* ── TOP NAV ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 4%',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'var(--surface-container-low)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <button onClick={() => navigate('/gallery')} className="btn-ghost cursor-zone" style={{ padding: '8px 16px', fontSize: 13 }}>
          <ChevronLeft size={16} /> Galeri
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 500 }}>Editor Undangan</span>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary cursor-zone" style={{ padding: '8px 20px', fontSize: 13 }}>
          <Save size={14} /> {isSaving ? 'Menyimpan...' : 'Publish'}
        </button>
      </nav>

      {/* ── SPLIT PANE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', flex: 1, overflow: 'hidden' }}>

        {/* LEFT — form */}
        <div style={{
          padding: '36px 4% 100px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          borderRight: '1px solid var(--outline-variant)',
        }}>
          <h2 className="headline-sm" style={{ marginBottom: 32 }}>Sesuaikan Detail Acara</h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Section: Dasar */}
            <div>
              <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={12} /> Pengaturan Dasar
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>{label('Nama Host')} <input className="input-underline" required value={hostName} onChange={e => setHostName(e.target.value)} /></div>
                <div>{label('Judul Halaman')} <input className="input-underline" required value={title} onChange={e => setTitle(e.target.value)} /></div>
                <div>{label('Kategori Acara')}
                  <select className="input-underline" value={eventType} onChange={e => setEventType(e.target.value)} style={{ width: '100%' }}>
                    <option value="wedding">Pernikahan</option>
                    <option value="birthday">Ulang Tahun</option>
                    <option value="khitanan">Khitanan</option>
                  </select>
                </div>
                <div>{label('Tema Estetik')}
                  <select className="input-underline" value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%' }}>
                    <option value="gold">Regal Gold</option>
                    <option value="neon">Cyber Neon</option>
                    <option value="batik">Modern Batik</option>
                    <option value="pastel">Sage Pastel</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Tokoh Acara */}
            <div>
              <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 16 }}>👤 Tokoh Utama Acara</p>
              {eventType === 'wedding' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>{label('Nama Mempelai Pria')} <input className="input-underline" value={groomName} onChange={e => setGroomName(e.target.value)} /></div>
                  <div>{label('Orang Tua Pria')} <input className="input-underline" value={groomParent} onChange={e => setGroomParent(e.target.value)} /></div>
                  <div>{label('Nama Mempelai Wanita')} <input className="input-underline" value={brideName} onChange={e => setBrideName(e.target.value)} /></div>
                  <div>{label('Orang Tua Wanita')} <input className="input-underline" value={brideParent} onChange={e => setBrideParent(e.target.value)} /></div>
                </div>
              )}
              {eventType === 'birthday' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                  <div>{label('Nama Penerima')} <input className="input-underline" value={celebrantName} onChange={e => setCelebrantName(e.target.value)} /></div>
                  <div>{label('Ulang Tahun Ke-')} <input type="number" className="input-underline" value={age} onChange={e => setAge(e.target.value)} /></div>
                </div>
              )}
              {eventType === 'khitanan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>{label('Nama Anak yang Dikhitan')} <input className="input-underline" value={celebrantName} onChange={e => setCelebrantName(e.target.value)} /></div>
                  <div>{label('Nama Orang Tua')} <input className="input-underline" value={parentNames} onChange={e => setParentNames(e.target.value)} /></div>
                </div>
              )}
            </div>

            {/* Section: Waktu & Lokasi */}
            <div>
              <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> Waktu & Lokasi
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>{label('Tanggal')} <input type="date" className="input-underline" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div>{label('Jam')} <input className="input-underline" value={time} onChange={e => setTime(e.target.value)} /></div>
              </div>
              <div style={{ marginTop: 20 }}>{label('Nama & Alamat Tempat')} <input className="input-underline" value={locationName} onChange={e => setLocationName(e.target.value)} /></div>
              <div style={{ marginTop: 20 }}>{label('Google Maps Embed URL')} <input className="input-underline" value={mapEmbedUrl} onChange={e => setMapEmbedUrl(e.target.value)} placeholder="src iframe dari Google Maps" /></div>
            </div>

            {/* Section: Media & Kutipan */}
            <div>
              <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Image size={12} /> Kutipan & Media
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>{label('URL Foto Utama')} <input className="input-underline" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
                <div>
                  {label('Kutipan Sambutan')}
                  <textarea rows="3" className="input-underline" value={quote} onChange={e => setQuote(e.target.value)} style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
                </div>
                <div>{label('Sumber Kutipan')} <input className="input-underline" value={quoteSource} onChange={e => setQuoteSource(e.target.value)} /></div>
                <div>{label('URL Lagu Latar (.mp3)')} <input className="input-underline" value={musicUrl} onChange={e => setMusicUrl(e.target.value)} /></div>
              </div>
            </div>

          </form>
        </div>

        {/* RIGHT — live preview simulator */}
        <div style={{
          background: 'var(--surface-container)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '40px 20px',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}>
          <div style={{
            width: 360,
            background: 'var(--background)',
            borderRadius: 32,
            border: '6px solid var(--surface-container-highest)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            minHeight: 640,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Notch */}
            <div style={{ height: 28, background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 80, height: 10, background: 'var(--surface-container-highest)', borderRadius: 999 }} />
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-low)' }}>
              {['envelope', 'detail'].map(tab => (
                <button key={tab} onClick={() => setPreviewTab(tab)} style={{
                  flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: previewTab === tab ? 'var(--background)' : 'transparent',
                  color: previewTab === tab ? 'var(--primary)' : 'var(--outline)',
                  borderBottom: previewTab === tab ? `2px solid ${accentColor}` : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  {tab === 'envelope' ? 'Amplop' : 'Detail'}
                </button>
              ))}
            </div>

            {/* Preview content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
              {previewTab === 'envelope' ? (
                /* Envelope preview — static wax seal representation */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 32, textAlign: 'center' }}>
                  <p className="label-sm" style={{ color: accentColor }}>
                    {eventType === 'wedding' ? 'Undangan Pernikahan' : eventType === 'birthday' ? 'Undangan Ulang Tahun' : 'Tasyakuran Khitan'}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: 'var(--on-surface)' }}>{hostName}</h2>
                  {/* Mini wax seal */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${accentColor}cc 0%, ${accentColor} 60%)`,
                    boxShadow: '0 4px 20px rgba(86,100,43,0.3), inset 0 1px 2px rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600
                  }}>
                    {hostName.charAt(0)}
                  </div>
                  <svg viewBox="0 0 200 10" style={{ width: '70%', opacity: 0.3 }} fill="none">
                    <path d="M0,5 C40,1 80,9 120,5 C160,1 180,9 200,5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="label-sm" style={{ color: 'var(--outline)' }}>Sentuh Segel untuk Membuka</p>
                </div>
              ) : (
                /* Detail preview */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {imageUrl && (
                    <img src={imageUrl} alt="preview" style={{
                      width: '100%', height: 140, objectFit: 'cover',
                      borderRadius: 'var(--radius-md)', filter: 'saturate(0.85) sepia(0.08)'
                    }} />
                  )}
                  <p className="label-sm" style={{ color: accentColor, textAlign: 'center' }}>
                    {eventType === 'wedding' ? 'Undangan Pernikahan' : eventType === 'birthday' ? 'Ulang Tahun' : 'Khitanan'}
                  </p>

                  {eventType === 'wedding' && (
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500 }}>{groomName}</h3>
                      <p className="label-sm" style={{ marginTop: 4 }}>{groomParent}</p>
                      <div style={{ fontSize: 20, margin: '8px 0', color: accentColor }}>&</div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500 }}>{brideName}</h3>
                      <p className="label-sm" style={{ marginTop: 4 }}>{brideParent}</p>
                    </div>
                  )}
                  {eventType === 'birthday' && (
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500 }}>{celebrantName}</h3>
                      <p style={{ color: accentColor, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>Sweet {age} Birthday</p>
                    </div>
                  )}
                  {eventType === 'khitanan' && (
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500 }}>{celebrantName}</h3>
                      <p className="label-sm" style={{ marginTop: 4 }}>{parentNames}</p>
                    </div>
                  )}

                  {quote && (
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontStyle: 'italic', borderLeft: `2px solid ${accentColor}`, paddingLeft: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                      "{quote.slice(0, 80)}{quote.length > 80 ? '...' : ''}"
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="label-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Calendar size={11} style={{ color: accentColor }} /> {date}
                    </div>
                    <div className="label-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <MapPin size={11} style={{ color: accentColor }} /> {locationName.slice(0, 36)}{locationName.length > 36 ? '...' : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
