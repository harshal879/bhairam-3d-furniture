import { Environment as DreiEnvironment, ContactShadows } from '@react-three/drei'

export function SceneEnvironment({ preset = 'apartment' as const }: { preset?: 'apartment' | 'studio' | 'city' | 'warehouse' }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 8, 3]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.35} />
      <DreiEnvironment preset={preset} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />
    </>
  )
}

export function RoomLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <pointLight position={[-1.5, 2.2, 0]} intensity={0.3} color="#fff5e6" />
      <pointLight position={[1.5, 2.2, -1]} intensity={0.25} color="#e8f0ff" />
      <DreiEnvironment preset="apartment" environmentIntensity={0.35} />
    </>
  )
}
