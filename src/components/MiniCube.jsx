import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

const OFF_COLOR = new THREE.Color('#fff')
const ON_COLOR = new THREE.Color('#e8944c')
const HOVER_COLOR = new THREE.Color('#2a2a4e')
const EMISSIVE_ON = new THREE.Color('#ff6b20')
const EMISSIVE_OFF = new THREE.Color('#000000')

export default function MiniCube({ id, position }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const active = useStore((s) => s.cubes[id].active)
  const activateCube = useStore((s) => s.activateCube)

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      activateCube(id)
    },
    [id, activateCube]
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material

    const targetColor = active ? ON_COLOR : hovered ? HOVER_COLOR : OFF_COLOR
    mat.color.lerp(targetColor, delta * 8)

    const targetEmissive = active ? EMISSIVE_ON : EMISSIVE_OFF
    mat.emissive.lerp(targetEmissive, delta * 6)

    const targetEmissiveIntensity = active ? 1.5 : 0
    mat.emissiveIntensity += (targetEmissiveIntensity - mat.emissiveIntensity) * delta * 6

    const targetOpacity = active ? 0.95 : hovered ? 0.5 : 0.2
    mat.opacity += (targetOpacity - mat.opacity) * delta * 8

    const targetScale = active ? 1.0 : hovered ? 0.95 : 0.85
    const s = meshRef.current.scale.x
    const newScale = s + (targetScale - s) * delta * 8
    meshRef.current.scale.setScalar(newScale)
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={0.85}
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
      <meshStandardMaterial
        color={OFF_COLOR}
        emissive={EMISSIVE_OFF}
        emissiveIntensity={0}
        transparent
        opacity={0.2}
        roughness={0.3}
        metalness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
