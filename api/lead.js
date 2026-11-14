const MAX_BODY = 6000;
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
  const origin = req.headers.origin, host = req.headers.host;
  if (origin && host && new URL(origin).host !== host) return send(res, 403, { error: "Origin not allowed." });
  let raw = "";
  try {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > MAX_BODY) return send(res, 413, { error: "درخواست بیش از حد بزرگ است." });
    }
    const b = JSON.parse(raw || "{}");
    if (typeof b.website === "string" && b.website.trim()) return send(res, 200, { reference: "received" }); // honeypot
    const name = String(b.name || "").trim();
    const email = String(b.email || "").trim().toLowerCase();
    const projectType = String(b.projectType || "").trim();
    const description = String(b.description || "").trim();
    if (!b.consent || name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160 || projectType.length > 100 || description.length < 10 || description.length > 3000) {
      return send(res, 400, { error: "لطفاً اطلاعات معتبر و رضایت ذخیره‌سازی را وارد کن." });
    }
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return send(res, 503, { error: "ثبت درخواست هنوز به پایگاه داده متصل نشده است." });
    const reference = `REQ-${Date.now().toString(36).toUpperCase()}`;
    const upstream = await fetch(`${process.env.SUPABASE_URL}/rest/v1/project_requests`, {
      method: "POST",
      headers: {
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ reference, name, email, project_type: projectType, description })
    });
    if (!upstream.ok) return send(res, 502, { error: "ذخیره درخواست انجام نشد. لطفاً کمی بعد دوباره تلاش کن." });
    return send(res, 200, { reference });
  } catch {
    return send(res, 400, { error: "در پردازش درخواست مشکلی پیش آمد." });
  }
};
