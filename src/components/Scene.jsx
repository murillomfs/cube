import { OrbitControls } from '@react-three/drei'
import CubeGrid from './CubeGrid'

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 14, 28]} />

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
