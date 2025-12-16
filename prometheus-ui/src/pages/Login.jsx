import { useState } from 'react'
import { THEME } from '../constants/theme'
import { useAuth } from '../context/AuthContext'
import prometheusLogo from '../assets/prometheus-logo.png'

function Login() {
  const { login, register, error, isLoading } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    
    try {
      if (isRegisterMode) {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed')
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setLocalError('')
  }

  const displayError = localError || error

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: THEME.BG_DARK }}>
      <div style={{ width: '400px', padding: '40px', background: THEME.BG_MEDIUM, borderRadius: '8px', border: '1px solid ' + THEME.BORDER }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={prometheusLogo} alt="Prometheus" style={{ width: '80px', height: '80px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '24px', color: THEME.TEXT_PRIMARY, letterSpacing: '8px', margin: 0 }}>PROMETHEUS</h1>
          <p style={{ fontSize: '10px', color: THEME.TEXT_MUTED, letterSpacing: '3px', marginTop: '8px' }}>COURSE GENERATION SYSTEM</p>
        </div>

        {displayError && (
          <div style={{ padding: '12px', background: 'rgba(244, 67, 54, 0.1)', border: '1px solid #F44336', borderRadius: '4px', marginBottom: '20px', color: '#F44336', fontSize: '12px', textAlign: 'center' }}>
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: THEME.TEXT_MUTED, letterSpacing: '2px', marginBottom: '8px' }}>NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '14px', background: THEME.BG_DARK, border: '1px solid ' + THEME.BORDER, borderRadius: '4px', color: THEME.TEXT_PRIMARY, fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: THEME.TEXT_MUTED, letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', background: THEME.BG_DARK, border: '1px solid ' + THEME.BORDER, borderRadius: '4px', color: THEME.TEXT_PRIMARY, fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: THEME.TEXT_MUTED, letterSpacing: '2px', marginBottom: '8px' }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px', background: THEME.BG_DARK, border: '1px solid ' + THEME.BORDER, borderRadius: '4px', color: THEME.TEXT_PRIMARY, fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '16px', background: THEME.GRADIENT_BUTTON, border: '1px solid ' + THEME.AMBER, borderRadius: '4px', color: '#000', fontSize: '12px', letterSpacing: '3px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'PLEASE WAIT...' : (isRegisterMode ? 'CREATE ACCOUNT' : 'LOGIN')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={toggleMode} style={{ background: 'transparent', border: 'none', color: THEME.AMBER, fontSize: '11px', cursor: 'pointer' }}>
            {isRegisterMode ? 'Already have an account? LOGIN' : 'Need an account? REGISTER'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: THEME.TEXT_MUTED }}>
          V2.1 + PKE BACKEND
        </div>
      </div>
    </div>
  )
}

export default Login
