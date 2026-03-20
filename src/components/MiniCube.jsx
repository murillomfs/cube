import { useCallback, useState } from 'react'
import { useStore } from '../store'

export default function MiniCube({ id, position }) {
  const [hovered, setHovered] = useState(false)
  const activateCube = useStore((s) => s.activateCube)

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      activateCube(id)
    },
    [id, activateCube]
  )

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )
}
