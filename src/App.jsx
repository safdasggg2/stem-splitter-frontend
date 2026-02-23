import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --border: #1e1e2e;
    --accent: #7c3aed;
    --accent2: #06b6d4;
    --vocal: #f472b6;
    --mr: #34d399;
    --text: #e2e8f0;
    --muted: #64748b;
    --danger: #f87171;
  }

  body {
    font-family: 'DM Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px;
    position: relative;
    overflow: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 50%);
    pointer-events: none;
  }

  .header {
    text-align: center;
    margin-bottom: 56px;
    position: relative;
  }

  .header-tag {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 12px;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, #fff 0%, var(--accent2) 50%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header p {
    margin-top: 16px;
    color: var(--muted);
    font-size: 13px;
    letter-spacing: 1px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 680px;
    position: relative;
  }

  /* Drop Zone */
  .dropzone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 64px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .dropzone:hover, .dropzone.drag-over {
    border-color: var(--accent);
    background: rgba(124,58,237,0.05);
  }

  .dropzone.drag-over::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%);
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .dropzone-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .dropzone h3 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .dropzone p {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }

  .dropzone input {
    display: none;
  }

  /* File preview */
  .file-preview {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 10px;
    padding: 16px;
    margin-top: 20px;
  }

  .file-icon {
    width: 40px;
    height: 40px;
    background: var(--accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .file-info { flex: 1; min-width: 0; }
  .file-name {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-size { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .remove-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    transition: color 0.2s;
  }
  .remove-btn:hover { color: var(--danger); }

  /* Options */
  .options {
    margin-top: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .option-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }
  select:focus { border-color: var(--accent); }

  /* Process Button */
  .process-btn {
    width: 100%;
    margin-top: 28px;
    padding: 16px;
    background: linear-gradient(135deg, var(--accent), #6d28d9);
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .process-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(124,58,237,0.4);
  }

  .process-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Progress */
  .progress-section {
    margin-top: 28px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--muted);
  }

  .progress-label { font-family: 'Syne', sans-serif; font-weight: 600; color: var(--text); }

  .progress-bar {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transition: width 0.3s ease;
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4));
    animation: shimmer 1s linear infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-40px); }
    100% { transform: translateX(40px); }
  }

  .status-text {
    margin-top: 10px;
    font-size: 11px;
    color: var(--accent2);
    letter-spacing: 1px;
  }

  /* Results */
  .results {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .result-card {
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .result-card.vocal {
    background: rgba(244,114,182,0.08);
    border: 1px solid rgba(244,114,182,0.2);
  }

  .result-card.mr {
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.2);
  }

  .result-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .vocal .result-dot { background: var(--vocal); box-shadow: 0 0 10px var(--vocal); }
  .mr .result-dot { background: var(--mr); box-shadow: 0 0 10px var(--mr); }

  .result-info { flex: 1; }
  .result-type {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .vocal .result-type { color: var(--vocal); }
  .mr .result-type { color: var(--mr); }
  .result-desc { font-size: 11px; color: var(--muted); }

  .result-actions { display: flex; gap: 8px; }

  .btn-play, .btn-dl {
    padding: 8px 14px;
    border-radius: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .vocal .btn-play {
    background: rgba(244,114,182,0.15);
    color: var(--vocal);
    border: 1px solid rgba(244,114,182,0.3);
  }
  .vocal .btn-play:hover { background: rgba(244,114,182,0.25); }

  .mr .btn-play {
    background: rgba(52,211,153,0.15);
    color: var(--mr);
    border: 1px solid rgba(52,211,153,0.3);
  }
  .mr .btn-play:hover { background: rgba(52,211,153,0.25); }

  .btn-dl {
    background: var(--border);
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-dl:hover { color: var(--text); border-color: var(--muted); }

  /* Waveform viz */
  .waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 24px;
    margin-top: 8px;
  }

  .wave-bar {
    width: 3px;
    border-radius: 2px;
    animation: wave 1.2s ease-in-out infinite;
  }

  .vocal .wave-bar { background: var(--vocal); }
  .mr .wave-bar { background: var(--mr); }

  @keyframes wave {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }

  /* API config section */
  .api-config {
    margin-top: 28px;
    padding: 16px;
    background: rgba(6,182,212,0.05);
    border: 1px solid rgba(6,182,212,0.15);
    border-radius: 10px;
  }

  .api-config summary {
    cursor: pointer;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent2);
    list-style: none;
  }

  .api-input {
    margin-top: 12px;
    display: flex;
    gap: 10px;
  }

  .api-input input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 9px 12px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    outline: none;
  }
  .api-input input:focus { border-color: var(--accent2); }

  .save-btn {
    padding: 9px 16px;
    background: rgba(6,182,212,0.1);
    border: 1px solid rgba(6,182,212,0.3);
    border-radius: 7px;
    color: var(--accent2);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
  }

  .footer {
    margin-top: 32px;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
    text-align: center;
    opacity: 0.6;
  }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: rgba(124,58,237,0.15);
    color: var(--accent);
    border: 1px solid rgba(124,58,237,0.2);
    margin-left: 8px;
  }
`;

const WAVE_BARS = Array.from({ length: 20 });

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const STEPS = [
  "파일 분석 중...",
  "AI 모델 로딩 중...",
  "주파수 분석 중...",
  "보컬 트랙 분리 중...",
  "MR 트랙 분리 중...",
  "파일 최적화 중...",
  "완료!",
];

export default function VocalSplitter() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState(null);
  const [model, setModel] = useState("demucs");
  const [format, setFormat] = useState("wav");
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [savedUrl, setSavedUrl] = useState("http://localhost:8000");
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef({});
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["audio/mpeg", "audio/wav", "audio/flac", "audio/ogg", "audio/mp4"];
    if (!allowed.some(t => f.type.startsWith("audio") || f.name.match(/\.(mp3|wav|flac|ogg|m4a)$/i))) {
      alert("오디오 파일만 지원됩니다 (MP3, WAV, FLAC, OGG, M4A)");
      return;
    }
    setFile(f);
    setResults(null);
    setProgress(0);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const simulateProgress = () => {
    let p = 0;
    let si = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) { p = 100; clearInterval(interval); }
      setProgress(Math.min(p, 100));
      si = Math.min(Math.floor(p / (100 / (STEPS.length - 1))), STEPS.length - 1);
      setStepIdx(si);
    }, 400);
    return interval;
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setResults(null);
    setProgress(0);
    setStepIdx(0);

    const interval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);
      formData.append("format", format);

      const res = await fetch(`${savedUrl}/separate`, {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      const data = await res.json();
      setProgress(100);
      setStepIdx(STEPS.length - 1);

      setTimeout(() => {
        setResults(data);
        setProcessing(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setProcessing(false);
      alert(`처리 실패: ${err.message}\n\n백엔드 서버가 실행 중인지 확인해주세요.`);
    }
  };

  const handlePlay = (type, url) => {
    if (playing === type) {
      audioRef.current[type]?.pause();
      setPlaying(null);
    } else {
      Object.values(audioRef.current).forEach(a => a?.pause());
      if (!audioRef.current[type]) {
        audioRef.current[type] = new Audio(`${savedUrl}${url}`);
        audioRef.current[type].onended = () => setPlaying(null);
      }
      audioRef.current[type].play();
      setPlaying(type);
    }
  };

  const handleDownload = (url, filename) => {
    const a = document.createElement("a");
    a.href = `${savedUrl}${url}`;
    a.download = filename;
    a.click();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-tag">✦ AI Audio Processor</div>
          <h1>STEM<br/>SPLITTER</h1>
          <p>Demucs 기반 MR / 보컬 분리 엔진</p>
        </header>

        <div className="card">
          {/* Dropzone */}
          <div
            className={`dropzone${dragOver ? " drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="audio/*" onChange={e => handleFile(e.target.files[0])} />
            <div className="dropzone-icon">🎵</div>
            <h3>오디오 파일 드롭</h3>
            <p>MP3, WAV, FLAC, OGG, M4A 지원<br/>클릭하거나 파일을 드래그하세요</p>
          </div>

          {/* File preview */}
          {file && (
            <div className="file-preview">
              <div className="file-icon">🎧</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatSize(file.size)}</div>
              </div>
              <button className="remove-btn" onClick={() => { setFile(null); setResults(null); }}>✕</button>
            </div>
          )}

          {/* Options */}
          <div className="options">
            <div>
              <div className="option-label">AI 모델</div>
              <select value={model} onChange={e => setModel(e.target.value)}>
                <option value="demucs">Demucs (고품질)</option>
                <option value="htdemucs">HTDemucs (최고품질)</option>
                <option value="spleeter">Spleeter (빠름)</option>
              </select>
            </div>
            <div>
              <div className="option-label">출력 포맷</div>
              <select value={format} onChange={e => setFormat(e.target.value)}>
                <option value="wav">WAV (무손실)</option>
                <option value="mp3">MP3 (압축)</option>
                <option value="flac">FLAC (무손실)</option>
              </select>
            </div>
          </div>

          {/* Process button */}
          <button
            className="process-btn"
            onClick={handleProcess}
            disabled={!file || processing}
          >
            {processing ? "⚙ 분리 처리 중..." : "▶ MR / 보컬 분리 시작"}
          </button>

          {/* Progress */}
          {processing && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">{STEPS[stepIdx]}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="status-text">AI가 음원을 분석하고 있습니다...</div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="results">
              {/* Vocal */}
              <div className="result-card vocal">
                <div className="result-dot" />
                <div className="result-info">
                  <div className="result-type">보컬 트랙 <span className="badge">VOCAL</span></div>
                  <div className="result-desc">분리된 보컬 / 사람 목소리</div>
                  <div className="waveform">
                    {WAVE_BARS.map((_, i) => (
                      <div
                        key={i}
                        className="wave-bar"
                        style={{
                          height: `${Math.random() * 20 + 4}px`,
                          animationDelay: `${i * 0.06}s`,
                          animationPlayState: playing === "vocal" ? "running" : "paused",
                          opacity: playing === "vocal" ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="result-actions">
                  <button className="btn-play vocal" onClick={() => handlePlay("vocal", results.vocal)}>
                    {playing === "vocal" ? "⏸" : "▶"} 재생
                  </button>
                  <button className="btn-dl" onClick={() => handleDownload(results.vocal, `vocal.${format}`)}>⬇</button>
                </div>
              </div>

              {/* MR */}
              <div className="result-card mr">
                <div className="result-dot" />
                <div className="result-info">
                  <div className="result-type">MR 트랙 <span className="badge" style={{background:'rgba(52,211,153,0.1)',color:'var(--mr)',borderColor:'rgba(52,211,153,0.2)'}}>MR</span></div>
                  <div className="result-desc">반주 / 악기 트랙 (보컬 제거)</div>
                  <div className="waveform">
                    {WAVE_BARS.map((_, i) => (
                      <div
                        key={i}
                        className="wave-bar"
                        style={{
                          height: `${Math.random() * 20 + 4}px`,
                          animationDelay: `${i * 0.06}s`,
                          animationPlayState: playing === "mr" ? "running" : "paused",
                          opacity: playing === "mr" ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="result-actions">
                  <button className="btn-play mr" onClick={() => handlePlay("mr", results.mr)}>
                    {playing === "mr" ? "⏸" : "▶"} 재생
                  </button>
                  <button className="btn-dl" onClick={() => handleDownload(results.mr, `mr.${format}`)}>⬇</button>
                </div>
              </div>
            </div>
          )}

          {/* API Config */}
          <details className="api-config">
            <summary>⚙ 백엔드 서버 설정</summary>
            <div className="api-input">
              <input
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
              />
              <button className="save-btn" onClick={() => setSavedUrl(apiUrl)}>저장</button>
            </div>
          </details>
        </div>

        <div className="footer">
          STEM SPLITTER — Powered by Demucs AI Model
        </div>
      </div>
    </>
  );
}