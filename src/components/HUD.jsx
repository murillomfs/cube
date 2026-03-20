import { useStore } from '../store'

const styles = {
  container: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  counter: {
    color: '#ffffff90',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
    letterSpacing: 1,
  },
  button: {
    padding: '8px 20px',
    background: '#ffffff10',
    border: '1px solid #ffffff20',
    borderRadius: 6,
    color: '#ffffffcc',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  progress: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    height: 3,
    background: 'linear-gradient(90deg, #ff6b20, #e8944c)',
    transition: 'width 0.6s ease-out',
    zIndex: 10,
  },
}

export default function HUD() {
  const activatedCount = useStore((s) => s.activatedCount)
  const total = useStore((s) => s.total)
  const activateRandom = useStore((s) => s.activateRandom)
  const reset = useStore((s) => s.reset)
  const autoRotate = useStore((s) => s.autoRotate)
  const toggleRotation = useStore((s) => s.toggleRotation)
  const pct = (activatedCount / total) * 100

  return (
    <>
      <div style={styles.container}>
        <span style={styles.counter}>
          {activatedCount} / {total}
        </span>
        <button
          style={styles.button}
          onClick={activateRandom}
          onMouseEnter={(e) => (e.target.style.background = '#ffffff20')}
          onMouseLeave={(e) => (e.target.style.background = '#ffffff10')}
        >
          Activate Random
        </button>
        <button
          style={styles.button}
          onClick={toggleRotation}
          onMouseEnter={(e) => (e.target.style.background = '#ffffff20')}
          onMouseLeave={(e) => (e.target.style.background = '#ffffff10')}
        >
          {autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        </button>
        <button
          style={styles.button}
          onClick={reset}
          onMouseEnter={(e) => (e.target.style.background = '#ffffff20')}
          onMouseLeave={(e) => (e.target.style.background = '#ffffff10')}
        >
          Reset
        </button>
      </div>
      <div style={{ ...styles.progress, width: `${pct}%` }} />
    </>
  )
}
