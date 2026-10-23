const HTML_PAGE = __HTML_PAGE__;
const SITE_TITLE = "刑事上訴期限計算器";

function getTaipeiDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(d);
}

function getYesterdayTaipei() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  return getTaipeiDate(yesterday);
}

export function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return null;
  const prefix = local.length <= 2 ? local[0] : local.slice(0, 2);
  return `${prefix}***@${domain}`;
}

export async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function handleUsage(request, env) {
  const authUserId = request.headers.get("oai-authenticated-user-id");
  const authEmail = request.headers.get("oai-authenticated-user-email");
  const ipHeader = request.headers.get("cf-connecting-ip") ||
                   request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  const rawIdentifier = authUserId
    ? `user:${authUserId}`
    : (ipHeader ? `ip:${ipHeader}` : `anon:${crypto.randomUUID()}`);

  const hashKey = env?.ANALYTICS_HASH_KEY || "taiwan-legal-calc-key-default";
  const userHash = await hmacSha256(rawIdentifier, hashKey);
  const maskedEmail = maskEmail(authEmail);
  const now = new Date();
  const createdAt = now.toISOString();
  const taipeiDate = getTaipeiDate(now);

  if (env?.DB) {
    try {
      await env.DB.prepare(
        "INSERT INTO usage_events (created_at, taipei_date, user_hash, masked_email) VALUES (?, ?, ?, ?)"
      ).bind(createdAt, taipeiDate, userHash, maskedEmail).run();

      // Bounded maintenance: prune rows older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      await env.DB.prepare(
        "DELETE FROM usage_events WHERE created_at < ?"
      ).bind(thirtyDaysAgo).run();
    } catch (err) {
      console.error("Failed to record usage event:", err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}

export async function handleMcp(request, env, siteTitle) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const { jsonrpc, id, method, params } = body || {};
  if (jsonrpc !== "2.0") {
    return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code: -32600, message: "Invalid Request" }, id: id ?? null }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  if (method === "server/discover" || method === "initialize") {
    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2026-07-28",
        supportedVersions: ["2026-07-28"],
        capabilities: { tools: {} },
        serverInfo: {
          name: siteTitle,
          version: "1.0.0"
        }
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  if (method === "tools/list") {
    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "get_daily_usage_summary",
            description: `取得【${siteTitle}】特定日期（預設為昨日，台北時間）的使用量統計摘要，包含總計算次數、獨立訪客數及去識別化活動紀錄。`,
            inputSchema: {
              type: "object",
              properties: {
                date: {
                  type: "string",
                  description: "欲查詢的台北日期，格式為 YYYY-MM-DD。若未提供，預設為昨日。"
                }
              }
            }
          }
        ]
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    if (toolName !== "get_daily_usage_summary") {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Tool not found: ${toolName}` }
      }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    const requestedDate = params?.arguments?.date;
    const targetDate = (typeof requestedDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate))
      ? requestedDate
      : getYesterdayTaipei();

    let totalUsage = 0;
    let uniqueUsers = 0;
    let userBreakdown = [];

    if (env?.DB) {
      try {
        const stats = await env.DB.prepare(
          "SELECT COUNT(*) AS total_count, COUNT(DISTINCT user_hash) AS user_count FROM usage_events WHERE taipei_date = ?"
        ).bind(targetDate).first();
        if (stats) {
          totalUsage = stats.total_count || 0;
          uniqueUsers = stats.user_count || 0;
        }

        const emailRows = await env.DB.prepare(
          "SELECT masked_email, COUNT(*) AS cnt FROM usage_events WHERE taipei_date = ? AND masked_email IS NOT NULL GROUP BY masked_email ORDER BY cnt DESC LIMIT 20"
        ).bind(targetDate).all();
        if (emailRows?.results) {
          userBreakdown = emailRows.results.map(r => `${r.masked_email} (${r.cnt} 次)`);
        }
      } catch (err) {
        console.error("D1 query error:", err);
      }
    }

    const breakdownText = userBreakdown.length > 0
      ? userBreakdown.join(", ")
      : "無登入者紀錄（皆為匿名訪客或未帶身份）";

    const summaryText = [
      `### 📊【${siteTitle}】每日使用量統計報告`,
      `- **統計日期（台北時區）**：${targetDate}`,
      `- **有效計算次數**：${totalUsage} 次`,
      `- **獨立訪客數（以 HMAC 雜湊判定）**：${uniqueUsers} 人`,
      `- **登入使用者分佈**：${breakdownText}`,
      `- **隱私保護說明**：本報告未紀錄或留存任何計算輸入（如本金、訴訟日期等），原始 IP 與使用者識別碼皆已雜湊，原始信箱已遮罩處理。`
    ].join("\n");

    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: summaryText
          }
        ]
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  return new Response(JSON.stringify({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}

export default {
  async fetch(request, env, ctx) {
    void ctx;
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML_PAGE, {
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }
    if (url.pathname === "/api/usage" && request.method === "POST") {
      return handleUsage(request, env);
    }
    if (url.pathname === "/mcp" && request.method === "POST") {
      return handleMcp(request, env, SITE_TITLE);
    }
    return new Response("Not found", { status: 404 });
  }
};
