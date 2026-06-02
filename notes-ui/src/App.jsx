import { useEffect, useState, useRef, memo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getNotes,
  addNote,
  deleteNote,
  togglePin
} from "./services/noteService";

const TAG_COLORS = ["#b794f4", "#76e4f7", "#f6ad55", "#68d391", "#fc8181"];

function timeAgo(dateStr) {
  if (!dateStr) return "just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getTagColor(id) {
  const idx = (typeof id === "number" ? id : parseInt(id, 36) || 0) % TAG_COLORS.length;
  return TAG_COLORS[Math.abs(idx)];
}

const NoteCard = memo(function NoteCard({ note, index, onPin, onDelete }) {
  const [spinning, setSpinning] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handlePin = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 400);
    onPin(note.id);
  };

  const handleDelete = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
    onDelete(note.id);
  };

  return (
    <div
      className={`sn-card${note.isPinned ? " pinned" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="sn-card-top">
        <div className="sn-tag-dot" style={{ background: getTagColor(note.id) }} />
        <div className="sn-card-title">{note.title}</div>
        {note.isPinned && <span className="sn-pinned-badge">📌 Pinned</span>}
      </div>
      <div className="sn-card-body">{note.content}</div>
      <div className="sn-card-footer">
        <span className="sn-timestamp">{timeAgo(note.createdAt)}</span>
        <div className="sn-actions">
          <button
            className={`sn-btn${spinning ? " spin" : ""}`}
            onClick={handlePin}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            {note.isPinned ? "📍" : "📌"}
          </button>
          <button
            className={`sn-btn del${shaking ? " shake" : ""}`}
            onClick={handleDelete}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  const loadNotes = useCallback(() => {
    getNotes()
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  useEffect(() => {
    const existing = document.getElementById("smart-notes-style");
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = "smart-notes-style";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html, body, #root {
        width: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        font-family: 'Inter', sans-serif;
      }

      .sn-root {
        --bg-primary: #0f0f13;
        --bg-sidebar: #13131a;
        --bg-card: #1a1a24;
        --bg-input: #1e1e2e;
        --bg-hover: #22223a;
        --accent: #7c5cfc;
        --accent-hover: #9b80ff;
        --accent-glow: rgba(124,92,252,0.25);
        --gold: #f6c90e;
        --gold-glow: rgba(246,201,14,0.18);
        --text-primary: #f0eeff;
        --text-muted: #7a7a9a;
        --border: rgba(255,255,255,0.07);
        --sidebar-w: 270px;
        --topbar-h: 56px;

        display: flex;
        width: 100%;
        min-height: 100vh;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
        transition: background 0.3s, color 0.3s;
        position: relative;
        overflow-x: hidden;
      }

      .sn-root.light {
        --bg-primary: #f5f4ff;
        --bg-sidebar: #ededff;
        --bg-card: #ffffff;
        --bg-input: #f0efff;
        --bg-hover: #e0dfff;
        --accent: #7c5cfc;
        --accent-hover: #5a3fd4;
        --accent-glow: rgba(124,92,252,0.15);
        --gold: #c89a00;
        --gold-glow: rgba(200,154,0,0.15);
        --text-primary: #1a1a2e;
        --text-muted: #6b6b8a;
        --border: rgba(0,0,0,0.08);
      }

      /* ── OVERLAY (mobile) ── */
      .sn-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 40;
        backdrop-filter: blur(2px);
      }
      .sn-overlay.show { display: block; }

      /* ── SIDEBAR ── */
      .sn-sidebar {
        width: var(--sidebar-w);
        min-width: var(--sidebar-w);
        background: var(--bg-sidebar);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        padding: 24px 20px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        transition: background 0.3s, transform 0.3s;
        flex-shrink: 0;
        z-index: 50;
      }

      .sn-brand { display:flex; align-items:center; gap:10px; margin-bottom:28px; }
      .sn-brand-icon { width:36px; height:36px; background:var(--accent); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
      .sn-brand-name { font-size:16px; font-weight:700; color:var(--text-primary); letter-spacing:-0.3px; }
      .sn-brand-sub { font-size:11px; color:var(--text-muted); }

      /* ── FLOATING LABEL ── */
      .sn-field { position:relative; margin-bottom:14px; }
      .sn-field label { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--text-muted); pointer-events:none; transition:all 0.2s; background:transparent; padding:0 3px; z-index:1; }
      .sn-field.textarea-field label { top:13px; transform:none; }
      .sn-field.active label,
      .sn-field.filled label { top:-8px; transform:translateY(0); font-size:10px; color:var(--accent); background:var(--bg-sidebar); }
      .sn-field.textarea-field.active label,
      .sn-field.textarea-field.filled label { top:-8px; }

      .sn-input { width:100%; padding:11px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:10px; color:var(--text-primary); font-size:13px; font-family:'Inter',sans-serif; outline:none; transition:border 0.2s,box-shadow 0.2s; }
      .sn-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
      .sn-textarea { resize:none; height:100px; line-height:1.5; }
      .sn-char-count { text-align:right; font-size:10px; color:var(--text-muted); margin-top:3px; }
      .sn-char-count.warn { color:#fc8181; }

      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      .sn-add-btn { width:100%; padding:11px; border:none; border-radius:10px; cursor:pointer; font-size:13px; font-weight:600; color:#fff; font-family:'Inter',sans-serif; background:linear-gradient(90deg,#7c5cfc,#c084fc,#7c5cfc); background-size:200% auto; transition:opacity 0.2s; }
      .sn-add-btn:hover { animation:shimmer 1.5s linear infinite; }

      .sn-stats { margin-top:auto; padding-top:20px; border-top:1px solid var(--border); display:flex; gap:12px; }
      .sn-stat { flex:1; background:var(--bg-input); border-radius:10px; padding:10px; text-align:center; }
      .sn-stat-val { font-size:20px; font-weight:700; color:var(--accent); }
      .sn-stat-label { font-size:10px; color:var(--text-muted); margin-top:2px; }

      /* ── MAIN ── */
      .sn-main { flex:1; display:flex; flex-direction:column; min-width:0; width:0; }

      /* ── TOPBAR ── */
      .sn-topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        background: var(--bg-primary);
        border-bottom: 1px solid var(--border);
        padding: 0 20px;
        height: var(--topbar-h);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.3s;
        width: 100%;
      }

      .sn-hamburger { display:none; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; width:34px; height:34px; cursor:pointer; font-size:16px; align-items:center; justify-content:center; flex-shrink:0; color:var(--text-primary); }

      .sn-topbar-title { font-size:15px; font-weight:600; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

      .sn-search-wrap { display:flex; align-items:center; gap:8px; flex-shrink:0; }
      .sn-search-pill { display:flex; align-items:center; background:var(--bg-card); border:1px solid var(--border); border-radius:20px; overflow:hidden; transition:width 0.3s; width:36px; height:36px; cursor:pointer; flex-shrink:0; }
      .sn-search-pill.open { width:180px; cursor:default; padding:0 12px; }
      .sn-search-icon { font-size:14px; flex-shrink:0; padding-left:10px; }
      .sn-search-pill.open .sn-search-icon { padding-left:0; }
      .sn-search-input { border:none; outline:none; background:transparent; color:var(--text-primary); font-size:13px; font-family:'Inter',sans-serif; width:0; opacity:0; transition:width 0.3s,opacity 0.3s; }
      .sn-search-pill.open .sn-search-input { width:120px; opacity:1; margin-left:6px; }
      .sn-found-badge { background:var(--accent); color:#fff; font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; white-space:nowrap; }
      .sn-theme-btn { width:34px; height:34px; border-radius:50%; border:1px solid var(--border); background:var(--bg-card); cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      .sn-theme-btn:hover { background:var(--bg-hover); }

      /* ── NOTES AREA ── */
      .sn-notes-area { padding:20px; flex:1; width:100%; }
      .sn-section-label { font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:var(--text-muted); margin-bottom:12px; }

      /* ── MASONRY ── */
      .sn-masonry { columns:4; column-gap:14px; margin-bottom:28px; width:100%; }
      @media(max-width:1400px){ .sn-masonry{ columns:3; } }
      @media(max-width:900px){  .sn-masonry{ columns:2; } }
      @media(max-width:500px){  .sn-masonry{ columns:1; } }

      /* ── CARD ── */
      @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin360 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

      .sn-card { break-inside:avoid; background:var(--bg-card); border-radius:14px; padding:15px; margin-bottom:14px; border-left:3px solid var(--accent); display:flex; flex-direction:column; gap:9px; animation:fadeInUp 0.35s ease both; transition:transform 0.2s,box-shadow 0.2s; }
      .sn-card:hover { transform:translateY(-4px); box-shadow:0 8px 28px var(--accent-glow); }
      .sn-card.pinned { border-left-color:transparent; border-top:2px solid var(--gold); box-shadow:0 0 0 1px var(--gold-glow); }
      .sn-card-top { display:flex; align-items:flex-start; gap:8px; }
      .sn-tag-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; }
      .sn-card-title { font-size:14px; font-weight:600; color:var(--text-primary); line-height:1.4; flex:1; word-break:break-word; }
      .sn-pinned-badge { display:inline-flex; align-items:center; font-size:9px; font-weight:600; color:var(--gold); background:var(--gold-glow); border:1px solid var(--gold); border-radius:20px; padding:1px 7px; white-space:nowrap; flex-shrink:0; }
      .sn-card-body { font-size:12px; color:var(--text-muted); line-height:1.65; overflow:hidden; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; word-break:break-word; }
      .sn-card-footer { display:flex; align-items:center; justify-content:space-between; }
      .sn-timestamp { font-size:10px; color:var(--text-muted); }
      .sn-actions { display:flex; gap:6px; }
      .sn-btn { border:none; background:var(--bg-input); border-radius:8px; width:30px; height:30px; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
      .sn-btn:hover { background:var(--bg-hover); }
      .sn-btn.spin { animation:spin360 0.4s ease; }
      .sn-btn.shake { animation:shake 0.4s ease; }
      .sn-btn.del:hover { color:#fc8181; }

      /* ── EMPTY STATE ── */
      .sn-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; gap:16px; opacity:0.55; }
      .sn-empty p { font-size:13px; color:var(--text-muted); text-align:center; }

      /* ── SCROLLBAR ── */
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:var(--border); border-radius:10px; }

      /* ══════════════════════════════════
         RESPONSIVE BREAKPOINTS
         ══════════════════════════════════ */

      /* Tablet: sidebar becomes a drawer */
      @media(max-width:768px){
        .sn-sidebar {
          position: fixed;
          left: 0; top: 0;
          height: 100vh;
          transform: translateX(-100%);
          box-shadow: 4px 0 24px rgba(0,0,0,0.4);
        }
        .sn-sidebar.open { transform: translateX(0); }
        .sn-main { width: 100%; }
        .sn-hamburger { display: flex; }
        .sn-notes-area { padding: 16px; }
        .sn-topbar { padding: 0 14px; }
      }

      /* Mobile: tighter spacing */
      @media(max-width:480px){
        .sn-notes-area { padding: 12px; }
        .sn-topbar { gap: 8px; }
        .sn-topbar-title { font-size:14px; }
        .sn-search-pill.open { width:140px; }
        .sn-search-pill.open .sn-search-input { width:90px; }
        .sn-found-badge { display: none; }
      }

      /* Large screens: wider sidebar */
      @media(min-width:1600px){
        .sn-root { --sidebar-w: 300px; }
        .sn-masonry { columns: 5; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("smart-notes-style");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  /* Close sidebar when clicking overlay */
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleDelete = useCallback((id) => {
    deleteNote(id)
      .then(() => { loadNotes(); toast.error("Note deleted!"); })
      .catch(() => toast.error("Delete failed"));
  }, [loadNotes]);

  const handlePin = useCallback((id) => {
    togglePin(id)
      .then(() => { loadNotes(); toast.info("Note updated!"); })
      .catch(() => toast.error("Update failed"));
  }, [loadNotes]);

  const handleAdd = () => {
    if (!title || !content) { toast.warning("Title and content required!"); return; }
    addNote({ title, content, isPinned: false })
      .then(() => { setTitle(""); setContent(""); loadNotes(); toast.success("Note added!"); setSidebarOpen(false); })
      .catch(() => toast.error("Failed to add note"));
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );
  const pinnedNotes = filtered.filter(n => n.isPinned);
  const otherNotes = filtered.filter(n => !n.isPinned);

  return (
    <div className={`sn-root${dark ? "" : " light"}`}>

      {/* Mobile overlay */}
      <div className={`sn-overlay${sidebarOpen ? " show" : ""}`} onClick={closeSidebar} />

      {/* ── SIDEBAR ── */}
      <aside className={`sn-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sn-brand">
          <div className="sn-brand-icon">📝</div>
          <div>
            <div className="sn-brand-name">Smart Notes</div>
            <div className="sn-brand-sub">Your ideas, organized</div>
          </div>
        </div>

        <div className={`sn-field${titleFocused ? " active" : title ? " filled" : ""}`}>
          <label>Title</label>
          <input
            className="sn-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
          />
        </div>

        <div className={`sn-field textarea-field${contentFocused ? " active" : content ? " filled" : ""}`}>
          <label>Write your note...</label>
          <textarea
            className="sn-input sn-textarea"
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 300))}
            onFocus={() => setContentFocused(true)}
            onBlur={() => setContentFocused(false)}
          />
          <div className={`sn-char-count${content.length > 260 ? " warn" : ""}`}>
            {content.length}/300
          </div>
        </div>

        <button className="sn-add-btn" onClick={handleAdd}>+ Add Note</button>

        <div className="sn-stats">
          <div className="sn-stat">
            <div className="sn-stat-val">{notes.length}</div>
            <div className="sn-stat-label">Total</div>
          </div>
          <div className="sn-stat">
            <div className="sn-stat-val">{notes.filter(n => n.isPinned).length}</div>
            <div className="sn-stat-label">Pinned</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="sn-main">
        <div className="sn-topbar">
          {/* Hamburger — visible on tablet/mobile */}
          <button className="sn-hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>

          <div className="sn-topbar-title">
            {search ? "Search results" : "All Notes"}
          </div>

          <div className="sn-search-wrap">
            {search && filtered.length > 0 && (
              <span className="sn-found-badge">{filtered.length} found</span>
            )}
            <div
              className={`sn-search-pill${searchOpen ? " open" : ""}`}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <span className="sn-search-icon">🔍</span>
              <input
                ref={searchRef}
                className="sn-search-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onBlur={() => { if (!search) setSearchOpen(false); }}
              />
            </div>
          </div>

          <button className="sn-theme-btn" onClick={() => setDark(d => !d)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="sn-notes-area">

          {pinnedNotes.length > 0 && (
            <>
              <div className="sn-section-label">⭐ Pinned</div>
              <div className="sn-masonry">
                {pinnedNotes.map((note, i) => (
                  <NoteCard key={note.id} note={note} index={i} onPin={handlePin} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}

          {otherNotes.length > 0 && (
            <>
              <div className="sn-section-label">📋 Notes</div>
              <div className="sn-masonry">
                {otherNotes.map((note, i) => (
                  <NoteCard key={note.id} note={note} index={i} onPin={handlePin} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="sn-empty">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="10" y="10" width="60" height="60" rx="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" opacity="0.3" />
                <path d="M28 30h24M28 40h16M28 50h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <circle cx="58" cy="58" r="12" fill="#7c5cfc" opacity="0.15" />
                <path d="M54 58h8M58 54v8" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p>{search ? "No notes match your search." : "No notes yet —\nadd your first one!"}</p>
            </div>
          )}
        </div>
      </main>

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        toastStyle={{
          background: dark ? "#1a1a24" : "#fff",
          color: dark ? "#f0eeff" : "#1a1a2e",
          borderRadius: "12px",
          border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          fontSize: "13px",
          fontFamily: "Inter, sans-serif"
        }}
      />
    </div>
  );
}