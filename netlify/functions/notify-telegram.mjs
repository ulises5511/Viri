
export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "1973832434";

  if (!token) {
    return new Response("Missing Telegram token", { status: 500 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (body.answer !== "yes") {
    return new Response("Invalid answer", { status: 400 });
  }

  const message =
    "❤️ ¡Viri aceptó tu invitación! 🍝\n\n" +
    "Tu cita italiana tiene luz verde. ¡Ve preparando el plan, Ulises!";

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    }
  );

  if (!response.ok) {
    return new Response("Telegram notification failed", { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
