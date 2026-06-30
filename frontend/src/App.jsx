import { useState, useRef } from "react";

const API_URL = "http://localhost:8000";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setHistory([]);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image || !query.trim()) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("query", query);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setResult(data.result);
        setHistory((prev) => [...prev, { query, result: data.result }]);
        setQuery("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not connect to the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🔍</span>
          <span style={styles.logoText}>ProductLens AI</span>
        </div>
        <p style={styles.tagline}>Drop any product image. Ask anything.</p>
      </header>

      <main style={styles.main}>
        <section style={styles.leftPanel}>
          <div
            style={{ ...styles.dropZone, ...(preview ? styles.dropZoneActive : {}) }}
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="product" style={styles.preview} />
            ) : (
              <div style={styles.dropPrompt}>
                <span style={styles.uploadIcon}>📦</span>
                <p style={styles.dropText}>Click to upload product image</p>
                <p style={styles.dropSub}>JPG, PNG, WEBP supported</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <button style={styles.changeBtn} onClick={() => fileRef.current.click()}>
              Change Image
            </button>
          )}

          <div style={styles.queryBox}>
            <textarea
              style={styles.textarea}
              placeholder="Ask something… e.g. 'Is this good for oily skin?' or 'What are the specs?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              rows={3}
            />
            <button
              style={{
                ...styles.analyzeBtn,
                opacity: !image || !query.trim() || loading ? 0.5 : 1,
                cursor: !image || !query.trim() || loading ? "not-allowed" : "pointer",
              }}
              onClick={handleAnalyze}
              disabled={!image || !query.trim() || loading}
            >
              {loading ? "Analyzing…" : "Analyze →"}
            </button>
          </div>

          <div style={styles.chips}>
            {["Describe this product", "Pros and Cons?", "Who is this for?", "Suggest alternatives"].map((p) => (
              <button key={p} style={styles.chip} onClick={() => setQuery(p)}>
                {p}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.rightPanel}>
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {!result && !loading && !error && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🛍️</span>
              <p style={styles.emptyTitle}>No analysis yet</p>
              <p style={styles.emptySub}>Upload a product image and ask your question to get started.</p>
            </div>
          )}

          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Analyzing your product…</p>
            </div>
          )}

          {result && !loading && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>
                <span style={styles.resultIcon}>✅</span>
                <span style={styles.resultTitle}>Analysis Complete</span>
              </div>
              <div style={styles.resultContent}>
                {result.split("\n").map((line, i) => {
                  if (!line.trim()) return <br key={i} />;
                  if (line.startsWith("**") && line.endsWith("**"))
                    return <h3 key={i} style={styles.resultH3}>{line.replace(/\*\*/g, "")}</h3>;
                  if (line.match(/^\d\.|^-|^\*/))
                    return <p key={i} style={styles.resultBullet}>{line.replace(/^[\d\.\-\*]\s*/, "• ")}</p>;
                  return <p key={i} style={styles.resultPara}>{line}</p>;
                })}
              </div>
            </div>
          )}

          {history.length > 1 && (
            <div style={styles.historySection}>
              <p style={styles.historyTitle}>Previous Questions</p>
              {history.slice(0, -1).reverse().map((h, i) => (
                <div key={i} style={styles.historyItem}>
                  <p style={styles.historyQ}>Q: {h.query}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f13", color: "#e8e8f0", fontFamily: "'Inter', sans-serif" },
  header: { padding: "2rem 3rem 1rem", borderBottom: "1px solid #1e1e2e" },
  logoRow: { display: "flex", alignItems: "center", gap: "0.6rem" },
  logoIcon: { fontSize: "1.6rem" },
  logoText: { fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.5px", color: "#a78bfa" },
  tagline: { color: "#666", fontSize: "0.9rem", marginTop: "0.3rem" },
  main: { display: "flex", gap: "2rem", padding: "2rem 3rem", flexWrap: "wrap" },
  leftPanel: { flex: "0 0 340px", display: "flex", flexDirection: "column", gap: "1rem" },
  dropZone: {
    border: "2px dashed #2d2d3d", borderRadius: "12px", minHeight: "240px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "border-color 0.2s", overflow: "hidden", background: "#13131a"
  },
  dropZoneActive: { border: "2px dashed #a78bfa" },
  dropPrompt: { textAlign: "center", padding: "2rem" },
  uploadIcon: { fontSize: "2.5rem" },
  dropText: { color: "#aaa", marginTop: "0.8rem", fontSize: "0.95rem" },
  dropSub: { color: "#555", fontSize: "0.8rem", marginTop: "0.3rem" },
  preview: { width: "100%", height: "240px", objectFit: "cover" },
  changeBtn: {
    background: "transparent", border: "1px solid #2d2d3d", color: "#888",
    borderRadius: "8px", padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.8rem"
  },
  queryBox: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  textarea: {
    background: "#13131a", border: "1px solid #2d2d3d", borderRadius: "10px",
    color: "#e8e8f0", padding: "0.8rem", fontSize: "0.9rem", resize: "none",
    outline: "none", fontFamily: "inherit"
  },
  analyzeBtn: {
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "0.8rem", fontSize: "0.95rem",
    fontWeight: 600, transition: "opacity 0.2s"
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  chip: {
    background: "#1a1a2e", border: "1px solid #2d2d3d", color: "#a78bfa",
    borderRadius: "20px", padding: "0.3rem 0.8rem", fontSize: "0.78rem",
    cursor: "pointer", transition: "background 0.2s"
  },
  rightPanel: { flex: 1, minWidth: "300px" },
  errorBox: { background: "#2a1010", border: "1px solid #7f1d1d", borderRadius: "10px", padding: "1rem", color: "#f87171" },
  emptyState: { textAlign: "center", padding: "4rem 2rem" },
  emptyIcon: { fontSize: "3rem" },
  emptyTitle: { color: "#666", fontSize: "1.1rem", marginTop: "1rem", fontWeight: 600 },
  emptySub: { color: "#444", fontSize: "0.85rem", marginTop: "0.5rem" },
  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem", gap: "1rem" },
  spinner: {
    width: "36px", height: "36px", border: "3px solid #2d2d3d",
    borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite"
  },
  loadingText: { color: "#666", fontSize: "0.9rem" },
  resultBox: { background: "#13131a", border: "1px solid #2d2d3d", borderRadius: "12px", overflow: "hidden" },
  resultHeader: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.2rem", background: "#1a1a2e", borderBottom: "1px solid #2d2d3d" },
  resultIcon: { fontSize: "1rem" },
  resultTitle: { color: "#a78bfa", fontWeight: 600, fontSize: "0.9rem" },
  resultContent: { padding: "1.2rem", maxHeight: "65vh", overflowY: "auto" },
  resultH3: { color: "#a78bfa", fontSize: "0.95rem", fontWeight: 700, margin: "1rem 0 0.3rem" },
  resultBullet: { color: "#ccc", fontSize: "0.88rem", margin: "0.3rem 0", paddingLeft: "0.5rem" },
  resultPara: { color: "#ccc", fontSize: "0.88rem", margin: "0.3rem 0", lineHeight: 1.6 },
  historySection: { marginTop: "1.5rem" },
  historyTitle: { color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" },
  historyItem: { background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "8px", padding: "0.6rem 0.8rem", marginBottom: "0.4rem" },
  historyQ: { color: "#666", fontSize: "0.83rem" },
};