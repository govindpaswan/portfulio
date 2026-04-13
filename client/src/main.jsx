import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#161626', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', padding: '2rem', maxWidth: '600px', width: '100%' }}>
            <h2 style={{ color: '#ef4444', fontFamily: 'monospace', marginBottom: '1rem' }}>⚠ App Crash</h2>
            <pre style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              {this.state.error.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#00d4ff', color: '#000', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
