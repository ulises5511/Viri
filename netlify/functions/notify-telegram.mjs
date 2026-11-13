
export default async (request) => {
  // Solo aceptar solicitudes POST
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Method Not Allowed"
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Obtener las variables privadas de Netlify
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Missing Telegram environment variables"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Leer la respuesta de la invitación
  let body;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid JSON"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  if (body.answer !== "yes") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid answer"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Mensaje que llegará a Telegram
  const message =
    "❤️ ¡Viri aceptó tu invitación! 🍝\n\n" +
    "Tu cita italiana tiene luz verde. " +
    "¡Ve preparando el plan, Ulises!";

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramResult = await response.json();

    if (!response.ok || !telegramResult.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            telegramResult.description ||
            "Telegram rejected the message"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Telegram notification sent"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Could not connect to Telegram"
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

