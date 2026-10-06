import { ContactShadows } from '@react-three/drei'

/**
 * Local-only lighting — no external HDRI/Environment fetch.
 * Drei's Environment presets load remote files and can hang Suspense
 * indefinitely when the network/CDN is blocked in some previews.
 */
export function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 8, 3]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <hemisphereLight args={['#f5f2ed', '#c4a574', 0.35]} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={12} blur={2.5} far={4} />
    </>
  )
}

export function RoomLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <pointLight position={[-1.5, 2.2, 0]} intensity={0.35} color="#fff5e6" />
      <pointLight position={[1.5, 2.2, -1]} intensity={0.3} color="#e8f0ff" />
      <hemisphereLight args={['#faf8f5', '#d4c4a8', 0.3]} />
    </>
  )
}
