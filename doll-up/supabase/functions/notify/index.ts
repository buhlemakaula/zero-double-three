// Supabase Edge Function: sends a Web Push to every registered device.
// Custom-authenticated via the push_secret in admin_config (deploy with
// verify_jwt = false). Reads VAPID keys + subscriptions with the service role.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  try {
    const supa = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const body = await req.json().catch(() => ({} as Record<string, unknown>))

    const { data: cfg } = await supa
      .from('admin_config')
      .select('vapid_public, vapid_private, push_secret')
      .eq('id', 1)
      .single()

    if (!cfg?.push_secret || body.secret !== cfg.push_secret) {
      return new Response('unauthorized', { status: 401 })
    }

    webpush.setVapidDetails(
      'mailto:noreply@dollup.co.za',
      cfg.vapid_public,
      cfg.vapid_private,
    )

    const payload = JSON.stringify({
      title: body.title || 'Doll Up Hair & Nail Art',
      body: body.body || '',
      url: body.url || '/admin',
    })

    const { data: subs } = await supa.from('push_subscriptions').select('*')
    let sent = 0
    let removed = 0
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        )
        sent++
      } catch (e) {
        const code = (e as { statusCode?: number })?.statusCode
        if (code === 404 || code === 410) {
          await supa.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
          removed++
        }
      }
    }
    return new Response(JSON.stringify({ sent, removed }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response('error: ' + ((e as Error)?.message ?? e), { status: 500 })
  }
})
