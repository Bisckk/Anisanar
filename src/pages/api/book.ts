import type { APIRoute } from 'astro';

export const prerender = false;

// ── Meta WhatsApp Cloud API ────────────────────────────────────────────────
// Variables de entorno necesarias (añádelas en Vercel → Settings → Environment Variables):
//   WA_TOKEN          → Access Token de tu Meta App
//   WA_PHONE_ID       → Phone Number ID de tu número de WhatsApp Business
//   WA_CLINIC_NUMBER  → Número de la clínica con código de país, sin + (ej: 34600000000)

const WA_API = 'https://graph.facebook.com/v19.0';

async function sendWhatsApp(to: string, body: string) {
  const res = await fetch(`${WA_API}/${import.meta.env.WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body, preview_url: false },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, petType, petName, service, message } = data;

    // ── Mensaje para la clínica ────────────────────────────────────────────
    const clinicMsg = [
      `🐾 *Nueva solicitud de cita — Anisanar*`,
      ``,
      `👤 *Cliente:* ${name}`,
      `📧 *Email:* ${email}`,
      phone   ? `📞 *Teléfono:* ${phone}` : null,
      petType ? `🐶 *Mascota:* ${petType}${petName ? ` (${petName})` : ''}` : null,
      `🏥 *Servicio:* ${service}`,
      message ? `💬 *Notas:* ${message}` : null,
      ``,
      `_Responde a este mensaje para confirmar la cita._`,
    ].filter(Boolean).join('\n');

    await sendWhatsApp(import.meta.env.WA_CLINIC_NUMBER, clinicMsg);

    // ── Mensaje de confirmación al cliente (solo si dejó su teléfono) ──────
    if (phone) {
      // Limpia el número: quita espacios, guiones y el + inicial
      const clientNumber = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');

      const clientMsg = [
        `¡Hola, ${name.split(' ')[0]}! 👋`,
        ``,
        `Hemos recibido tu solicitud de cita en *Anisanar Veterinaria*.`,
        ``,
        `📋 *Resumen:*`,
        petType ? `• Mascota: ${petType}${petName ? ` (${petName})` : ''}` : null,
        `• Servicio: ${service}`,
        ``,
        `Nos pondremos en contacto contigo en menos de 24 horas para confirmar el horario. ¡Hasta pronto! 🐾`,
      ].filter(Boolean).join('\n');

      await sendWhatsApp(clientNumber, clientMsg);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[book API]', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
