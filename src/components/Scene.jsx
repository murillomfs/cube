import { OrbitControls, Environment } from '@react-three/drei'
import CubeGrid from './CubeGrid'

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 12, 25]} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#c8d0e0" />
      <directionalLight position={[-3, -2, -5]} intensity={0.15} color="#4060a0" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#ff9050" distance={8} />

      <Environment preset="city" environmentIntensity={0.2} />

      <CubeGrid />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={16}
        autoRotate
        autoRotateSpeed={0.4}
        dampingFactor={0.05}
      />
    </>
  )
}
