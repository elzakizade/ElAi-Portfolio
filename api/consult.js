const MAX_BODY = 12000;
const SYSTEM = `You are a friendly, practical online project consultant for a digital services studio. The visitor's goal is to turn ideas into real projects. Help clarify requirements, suggest a feasible path, and guide them to submit a project request. Areas: AI solutions, data analytics, machine learning, Python development, workflow automation with n8n, websites and digital products, and custom Telegram and Bale messenger bots. Bot examples include automated replies, order intake, booking/request tracking, notifications, admin panels, and integrations with APIs, databases, AI models, and n8n. Do not claim a bot has already been built unless the visitor is referring to a documented portfolio project. Clarify which messenger (Telegram or Bale), user flow, integrations, and admin needs are required. Ask one focused question at a time. Do not invent prices, timelines, credentials, completed work, or guarantees. Do not ask for passwords, payment-card data, government IDs, or sensitive personal information. If asked for a quote, explain that scope is needed and invite them to submit the project form. If they ask about Telegram or Bale bots, confirm that custom bot development is offered and ask one focused question about the desired bot workflow. Reply in the user's language, preferably Persian. Keep replies concise and useful.`;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}
module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed." });
  if (!req.headers["content-type"]?.includes("application/json")) return send(res, 415, { error: "JSON required." });
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host && new URL(origin).host !== host) return send(res, 403, { error: "Origin not allowed." });
  let raw = "";
  try {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > MAX_BODY) return send(res, 413, { error: "درخواست بیش از حد بزرگ است." });
    }
    const body = JSON.parse(raw || "{}");
    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length < 1 || messages.length > 10) return send(res, 400, { error: "پیام‌ها معتبر نیستند." });
    const safe = [];
    for (const m of messages) {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 2000) {
        return send(res, 400, { error: "ساختار پیام معتبر نیست." });
      }
      safe.push({ role: m.role, content: m.content });
    }
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) return send(res, 503, { error: "مشاور هنوز پیکربندی نشده است. لطفاً از فرم ثبت درخواست استفاده کن." });
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL,
        instructions: SYSTEM,
        input: safe,
        store: false,
        max_output_tokens: 450
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return send(res, 502, { error: "ارتباط با سرویس مشاور برقرار نشد." });
    const reply = (data.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\n").trim();
    return send(res, 200, { reply: reply || "می‌تونی کمی بیشتر درباره ایده‌ات توضیح بدی؟" });
  } catch {
    return send(res, 400, { error: "در پردازش درخواست مشکلی پیش آمد." });
  }
};
