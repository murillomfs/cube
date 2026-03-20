import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import HUD from './components/HUD'

export default function App() {
  return (
    <>
      <Canvas
        camera={{ position: [6, 5, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      <HUD />
    </>
  )
}
