export { renderers } from '../../renderers.mjs';

const prerender = false;
const WA_API = "https://graph.facebook.com/v19.0";
async function sendWhatsApp(to, body) {
  const res = await fetch(`${WA_API}/${undefined                           }/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${undefined                        }`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body, preview_url: false }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }
}
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, petType, petName, service, message } = data;
    const configured = undefined                         && undefined                            && undefined                                ;
    if (!configured) {
      console.info("[book API] Demo mode — credenciales WA no configuradas, simulando éxito.");
      return new Response(JSON.stringify({ ok: true, demo: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const clinicMsg = [
      `🐾 *Nueva solicitud de cita — Anisanar*`,
      ``,
      `👤 *Cliente:* ${name}`,
      `📧 *Email:* ${email}`,
      phone ? `📞 *Teléfono:* ${phone}` : null,
      petType ? `🐶 *Mascota:* ${petType}${petName ? ` (${petName})` : ""}` : null,
      `🏥 *Servicio:* ${service}`,
      message ? `💬 *Notas:* ${message}` : null,
      ``,
      `_Responde a este mensaje para confirmar la cita._`
    ].filter(Boolean).join("\n");
    await sendWhatsApp(undefined                                , clinicMsg);
    if (phone) {
      const clientNumber = phone.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "");
      const clientMsg = [
        `¡Hola, ${name.split(" ")[0]}! 👋`,
        ``,
        `Hemos recibido tu solicitud de cita en *Anisanar Veterinaria*.`,
        ``,
        `📋 *Resumen:*`,
        petType ? `• Mascota: ${petType}${petName ? ` (${petName})` : ""}` : null,
        `• Servicio: ${service}`,
        ``,
        `Nos pondremos en contacto contigo en menos de 24 horas para confirmar el horario. ¡Hasta pronto! 🐾`
      ].filter(Boolean).join("\n");
      await sendWhatsApp(clientNumber, clientMsg);
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[book API]", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
