import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import MiniCube from './MiniCube'
import { useStore } from '../store'

export default function CubeGrid() {
  const groupRef = useRef()
  const grid = useStore((s) => s.grid)

  const positions = useMemo(() => {
    const result = []
    const spacing = 1.15
    const offsetX = ((grid.x - 1) * spacing) / 2
    const offsetY = ((grid.y - 1) * spacing) / 2
    const offsetZ = ((grid.z - 1) * spacing) / 2

    let id = 0
    for (let y = 0; y < grid.y; y++) {
      for (let z = 0; z < grid.z; z++) {
        for (let x = 0; x < grid.x; x++) {
          result.push({
            id,
            position: [
              x * spacing - offsetX,
              y * spacing - offsetY,
              z * spacing - offsetZ,
            ],
          })
          id++
        }
      }
    }
    return result
  }, [grid])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {positions.map(({ id, position }) => (
        <MiniCube key={id} id={id} position={position} />
      ))}
    </group>
  )
}
