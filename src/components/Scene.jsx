import { OrbitControls } from '@react-three/drei'
import CubeGrid from './CubeGrid'
import { useStore } from '../store'

export default function Scene() {
  const autoRotate = useStore((s) => s.autoRotate)

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
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        dampingFactor={0.05}
      />
    </>
  )
}
