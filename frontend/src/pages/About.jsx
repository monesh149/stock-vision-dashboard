import {
  Code,
  Database,
  Cpu,
  Shield,
  BarChart3,
  Globe,
  Activity,
  TrendingUp,
  Search,
  Bookmark,
  LineChart,
  Server,
} from 'lucide-react';

export default function About() {
  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700 }}>About StockVision</h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 600, margin: '8px auto 0' }}>
          A full-stack stock analysis platform that combines real-time market data
          with advanced technical analysis tools.
        </p>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={20} /> What is StockVision?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
          StockVision is a comprehensive stock analysis application built to
          democratize access to professional-grade technical analysis tools.
          It provides stock data, interactive charts, technical indicators,
          and analytical signals in a clean, modern interface.
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Whether you are a beginner exploring the stock market or an
          experienced trader looking for quick technical insights, StockVision
          offers the tools you need to analyze stocks efficiently.
        </p>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={20} /> Features
        </h3>
        <div className="grid-2">
          {[
            { icon: Search, title: 'Stock Discovery', desc: 'Browse and search stocks with real-time pricing data.' },
            { icon: LineChart, title: 'Interactive Charts', desc: 'Visualize stock price history with dynamic charts.' },
            { icon: Activity, title: 'Technical Analysis', desc: 'Access RSI, SMA, EMA, MACD, Bollinger Bands, and more.' },
            { icon: Shield, title: 'Trading Signals', desc: 'Receive buy, hold, or sell recommendations.' },
            { icon: Bookmark, title: 'Watchlist', desc: 'Save favorite stocks for quick access and monitoring.' },
            { icon: Globe, title: 'Responsive Design', desc: 'Seamless experience across desktop and mobile.' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <f.icon size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code size={20} /> Tech Stack
        </h3>
        <div className="grid-3">
          {[
            { icon: Globe, title: 'Frontend', items: ['React 18', 'Vite', 'Chart.js', 'React Router', 'Lucide Icons'] },
            { icon: Server, title: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST API'] },
            { icon: Database, title: 'Analytics', items: ['Python 3.11', 'Flask', 'pandas', 'NumPy', 'scikit-learn'] },
          ].map((stack) => (
            <div key={stack.title} style={{ textAlign: 'center' }}>
              <stack.icon size={28} style={{ margin: '0 auto 10px', color: 'var(--text-secondary)' }} />
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{stack.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stack.items.map((item) => (
                  <span key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 6, padding: '6px 10px' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={20} /> Architecture
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
          StockVision follows a three-service architecture with clean separation of concerns:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'React Frontend', desc: 'Single-page application with routing, charts, and responsive UI. Communicates with the Node.js backend via REST API.', border: 'var(--text-primary)' },
            { name: 'Node.js Backend', desc: 'Express server handling business logic, MongoDB for persistence, and proxying analytics requests to the Python service.', border: 'var(--text-secondary)' },
            { name: 'Python Analytics', desc: 'Flask microservice computing technical indicators, generating trading signals, and performing statistical analysis.', border: 'var(--text-muted)' },
          ].map((s) => (
            <div key={s.name} style={{ borderLeft: `3px solid ${s.border}`, paddingLeft: 14, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: '0 8px 8px 0' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.name}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={20} /> How to Run
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '1. Frontend', code: 'cd frontend\nnpm install\nnpm run dev' },
            { step: '2. Backend', code: 'cd backend\nnpm install\nnpm run dev' },
            { step: '3. Analytics', code: 'cd analytics\npip install -r requirements.txt\npython app.py' },
          ].map((s) => (
            <div key={s.step}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{s.step}</h4>
              <pre style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, fontSize: 13, color: 'var(--text-secondary)', overflow: 'auto', fontFamily: 'monospace' }}>
                {s.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer">
        <strong>Disclaimer:</strong> StockVision is built for educational and demonstration purposes.
        The analysis, signals, and data presented should not be construed as financial advice.
        Always consult a qualified financial advisor before making investment decisions.
      </div>
    </div>
  );
}
