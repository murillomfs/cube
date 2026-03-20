import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

const POINTS_PER_CUBE = 200
const CUBE_SIZE = 0.9

function generateCubeSurfacePoints(count) {
  const positions = []
  const half = CUBE_SIZE / 2
  const edgeCount = Math.floor(count * 0.3)
  const faceCount = count - edgeCount

  const perFace = Math.ceil(faceCount / 6)
  for (let face = 0; face < 6; face++) {
    for (let i = 0; i < perFace && positions.length / 3 < faceCount; i++) {
      const u = (Math.random() - 0.5) * CUBE_SIZE
      const v = (Math.random() - 0.5) * CUBE_SIZE
      switch (face) {
        case 0: positions.push(half, u, v); break
        case 1: positions.push(-half, u, v); break
        case 2: positions.push(u, half, v); break
        case 3: positions.push(u, -half, v); break
        case 4: positions.push(u, v, half); break
        case 5: positions.push(u, v, -half); break
      }
    }
  }

  const perEdge = Math.ceil(edgeCount / 12)
  const edges = [
    [[-1,-1,-1],[1,-1,-1]], [[-1,1,-1],[1,1,-1]], [[-1,-1,1],[1,-1,1]], [[-1,1,1],[1,1,1]],
    [[-1,-1,-1],[-1,1,-1]], [[1,-1,-1],[1,1,-1]], [[-1,-1,1],[-1,1,1]], [[1,-1,1],[1,1,1]],
    [[-1,-1,-1],[-1,-1,1]], [[1,-1,-1],[1,-1,1]], [[-1,1,-1],[-1,1,1]], [[1,1,-1],[1,1,1]],
  ]
  for (const [a, b] of edges) {
    for (let i = 0; i < perEdge && positions.length / 3 < count; i++) {
      const t = Math.random()
      positions.push(
        (a[0] + (b[0] - a[0]) * t) * half,
        (a[1] + (b[1] - a[1]) * t) * half,
        (a[2] + (b[2] - a[2]) * t) * half
      )
    }
  }

  return positions
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uActivations[100];

  attribute float aCubeId;
  attribute vec3 aOffset;
  attribute vec3 aRandom;

  varying float vActivation;

  void main() {
    float activation = uActivations[int(aCubeId)];
    vActivation = activation;

    vec3 localPos = position;

    float drift = sin(uTime * 0.6 + aRandom.x * 6.2831) * 0.012
                + cos(uTime * 0.4 + aRandom.y * 6.2831) * 0.008;
    localPos += aRandom * drift;

    float pulse = sin(uTime * 2.0 + aCubeId * 0.3) * 0.006 * activation;
    localPos += normalize(localPos + 0.001) * pulse;

    vec3 worldPos = localPos + aOffset;

    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);

    float baseSize = mix(1.2, 2.0, activation);
    gl_PointSize = baseSize * (55.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  varying float vActivation;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    if (dist > 0.4) discard;

    float sharp = 1.0 - smoothstep(0.3, 0.4, dist);

    vec3 offColor = vec3(0.3, 0.4, 0.6);
    vec3 onColor = vec3(1.0, 0.55, 0.18);
    vec3 color = mix(offColor, onColor, vActivation);

    float brightness = mix(0.45, 1.3, vActivation);
    color *= brightness;

    float alpha = sharp * mix(0.6, 1.0, vActivation);

    gl_FragColor = vec4(color, alpha);
  }
`

export default function PointCloud({ cubePositions }) {
  const materialRef = useRef()
  const activationsRef = useRef(new Float32Array(100))

  const geometry = useMemo(() => {
    const totalPoints = cubePositions.length * POINTS_PER_CUBE

    const positions = new Float32Array(totalPoints * 3)
    const cubeIds = new Float32Array(totalPoints)
    const offsets = new Float32Array(totalPoints * 3)
    const randoms = new Float32Array(totalPoints * 3)

    let ptr = 0
    for (const { id, position: offset } of cubePositions) {
      const surfacePoints = generateCubeSurfacePoints(POINTS_PER_CUBE)

      for (let i = 0; i < POINTS_PER_CUBE; i++) {
        const idx = ptr + i
        positions[idx * 3] = surfacePoints[i * 3]
        positions[idx * 3 + 1] = surfacePoints[i * 3 + 1]
        positions[idx * 3 + 2] = surfacePoints[i * 3 + 2]

        cubeIds[idx] = id
        offsets[idx * 3] = offset[0]
        offsets[idx * 3 + 1] = offset[1]
        offsets[idx * 3 + 2] = offset[2]

        randoms[idx * 3] = Math.random() * 2 - 1
        randoms[idx * 3 + 1] = Math.random() * 2 - 1
        randoms[idx * 3 + 2] = Math.random() * 2 - 1
      }
      ptr += POINTS_PER_CUBE
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aCubeId', new THREE.BufferAttribute(cubeIds, 1))
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    return geo
  }, [cubePositions])

  useFrame((_, delta) => {
    if (!materialRef.current) return
    const cubes = useStore.getState().cubes
    const arr = activationsRef.current

    for (let i = 0; i < cubes.length; i++) {
      const target = cubes[i].active ? 1.0 : 0.0
      arr[i] += (target - arr[i]) * Math.min(delta * 5, 1)
    }

    materialRef.current.uniforms.uActivations.value = arr
    materialRef.current.uniforms.uTime.value += delta
  })

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uActivations: { value: new Float32Array(100) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
