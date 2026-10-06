/**
 * Model loading helpers.
 * V1 uses procedural geometry (modelPath: null).
 * When GLB assets are added, load via useGLTF from @react-three/drei.
 *
 * Scale convention: product data in mm → Three.js metres (÷ 1000).
 */

export function resolveModelPath(modelPath: string | null): string | null {
  if (!modelPath) return null
  if (modelPath.startsWith('http') || modelPath.startsWith('/')) return modelPath
  return `/models/${modelPath}`
}

export const MODEL_LOAD_TIMEOUT_MS = 15000
