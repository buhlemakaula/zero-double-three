import { supabase, isSupabaseConfigured } from './supabase.js'
import { adminAddPush } from './admin.js'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export function pushSupported() {
  return (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Current state on this device: 'unsupported' | 'denied' | 'on' | 'off'
export async function pushStatus() {
  if (!pushSupported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    const sub = reg && (await reg.pushManager.getSubscription())
    return sub ? 'on' : 'off'
  } catch {
    return 'off'
  }
}

// Subscribe this device and store it against Doll Up's account (passcode-gated).
export async function enablePush(pass) {
  if (!isSupabaseConfigured) throw new Error('The database is not connected.')
  if (!pushSupported()) {
    throw new Error(
      'This device can’t do notifications here. On iPhone, install the app to your home screen first, then open it and try again.',
    )
  }
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') {
    throw new Error('Notifications were blocked. Allow them for this site in your browser settings.')
  }
  const reg = await navigator.serviceWorker.ready
  const { data: pub, error } = await supabase.rpc('push_public_key')
  if (error || !pub) throw new Error('Could not load the notification key.')

  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(pub),
    })
  }
  await adminAddPush(pass, sub.toJSON())
  return true
}
