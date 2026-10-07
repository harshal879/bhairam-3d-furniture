/**
 * Rear-camera access for the "View in Your Room" overlay demo.
 * Stops all tracks on cleanup — call stop() when leaving the page.
 */
export type CameraErrorKind =
  | 'unsupported'
  | 'insecure'
  | 'denied'
  | 'unavailable'
  | 'unknown'

export function getCameraErrorMessage(kind: CameraErrorKind): string {
  switch (kind) {
    case 'unsupported':
      return 'This browser does not support camera access.'
    case 'insecure':
      return 'Camera access requires a secure connection (HTTPS). Open this page over HTTPS on your phone.'
    case 'denied':
      return 'Camera permission was denied. Enable camera access in your browser settings and try again.'
    case 'unavailable':
      return 'No camera was found, or it is already in use by another app.'
    default:
      return 'Something went wrong while opening the camera.'
  }
}

export async function startRearCamera(
  video: HTMLVideoElement,
): Promise<{ stream: MediaStream; stop: () => void }> {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw Object.assign(new Error('unsupported'), { kind: 'unsupported' as CameraErrorKind })
  }
  if (!window.isSecureContext) {
    throw Object.assign(new Error('insecure'), { kind: 'insecure' as CameraErrorKind })
  }

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })
  } catch (err) {
    const name = err instanceof DOMException ? err.name : ''
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      throw Object.assign(err instanceof Error ? err : new Error('denied'), { kind: 'denied' as CameraErrorKind })
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'NotReadableError') {
      throw Object.assign(err instanceof Error ? err : new Error('unavailable'), {
        kind: 'unavailable' as CameraErrorKind,
      })
    }
    throw Object.assign(err instanceof Error ? err : new Error('unknown'), { kind: 'unknown' as CameraErrorKind })
  }

  video.srcObject = stream
  video.setAttribute('playsinline', 'true')
  video.muted = true
  await video.play().catch(() => {
    /* autoplay policies — playsinline + muted usually OK */
  })

  const stop = () => {
    stream.getTracks().forEach((t) => t.stop())
    if (video.srcObject === stream) video.srcObject = null
  }

  return { stream, stop }
}

/** Narrow viewports are the primary camera audience; wide screens see the desktop gate. */
export function isMobileCameraAudience(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 900px)').matches
}
