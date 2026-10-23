const HTML_PAGE = "<!doctype html>\n<html lang=\"zh-Hant\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n  <meta name=\"description\" content=\"依民法第203條、第233條第1項，以週年利率5%計算法定遲延利息。\">\n  <title>法定遲延利息計算器</title>\n  <style>\n    :root{--ink:#18263a;--muted:#637083;--blue:#1d4f78;--blue2:#2c6e9e;--cream:#f5f0e6;--card:#fffdfa;--line:#d8ddd9;--gold:#be8c42;--soft:#e9f1f6;--danger:#a33b32}\n    *{box-sizing:border-box}body{margin:0;min-height:100vh;color:var(--ink);font-family:\"Noto Sans TC\",\"PingFang TC\",\"Microsoft JhengHei\",sans-serif;background:linear-gradient(135deg,#f7f3ea 0%,#eef4f5 56%,#e7eff3 100%)}\n    body::before{content:\"\";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(29,79,120,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(29,79,120,.035) 1px,transparent 1px);background-size:32px 32px;mask-image:linear-gradient(to bottom,black,transparent 68%)}\n    .shell{position:relative;width:min(1120px,calc(100% - 32px));margin:auto;padding:30px 0 46px}\n    header{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px}.brand{display:flex;align-items:center;gap:12px;font-weight:850;letter-spacing:.04em}.mark{display:grid;place-items:center;width:39px;height:39px;border-radius:11px;background:var(--blue);color:#fff;font-family:serif;font-size:20px;box-shadow:4px 4px 0 rgba(190,140,66,.35)}\n    .back{font-size:13px;color:var(--blue);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px}\n    main{display:grid;grid-template-columns:minmax(0,.9fr) minmax(430px,1.1fr);gap:46px;align-items:start}\n    .intro{padding-top:24px}.eyebrow{margin:0 0 15px;color:var(--blue2);font-size:12px;font-weight:900;letter-spacing:.2em}.rate{display:inline-flex;align-items:center;gap:10px;margin-bottom:22px;padding:8px 13px;border:1px solid rgba(190,140,66,.45);border-radius:999px;background:rgba(255,253,250,.62);color:#755522;font-size:13px;font-weight:800}.rate b{font-size:17px;color:var(--gold)}\n    h1{font-family:\"Noto Serif TC\",\"Songti TC\",serif;font-size:clamp(44px,6vw,70px);line-height:1.04;letter-spacing:-.04em;margin:0 0 22px}.lead{max-width:530px;margin:0 0 30px;font-size:17px;line-height:1.8;color:#526174}\n    .laws{display:grid;gap:11px}.law{display:grid;grid-template-columns:82px 1fr;gap:14px;padding:15px 17px;border:1px solid rgba(216,221,217,.9);border-radius:14px;background:rgba(255,255,255,.55)}.law strong{font-family:serif;color:var(--blue)}.law span{font-size:13px;line-height:1.6;color:var(--muted)}\n    .calculator{background:var(--card);border:1px solid #e0e2de;border-radius:24px;padding:29px;box-shadow:0 22px 70px rgba(31,54,70,.13)}\n    .field{margin-bottom:18px}.field label{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:14px;font-weight:850}.field label small{color:var(--muted);font-weight:500}\n    input{width:100%;height:56px;border:1.5px solid #bcc8ce;border-radius:12px;background:#fff;color:var(--ink);padding:0 15px;font:650 17px inherit;outline:none}input:focus{border-color:var(--blue2);box-shadow:0 0 0 4px rgba(44,110,158,.12)}input[aria-invalid=true]{border-color:var(--danger)}\n    .money-wrap{position:relative}.money-wrap::before{content:\"NT$\";position:absolute;left:16px;top:17px;font-size:14px;font-weight:800;color:var(--muted)}#principal{padding-left:54px;text-align:right;font-size:20px}\n    .dates{display:grid;grid-template-columns:1fr 1fr;gap:13px}.calculate{width:100%;height:55px;margin-top:3px;border:0;border-radius:12px;background:var(--blue);color:white;font:800 16px inherit;cursor:pointer;transition:.18s}.calculate:hover{background:#153f62;transform:translateY(-1px)}\n    .error{display:none;margin:13px 0 0;color:var(--danger);font-size:13px}.error.show{display:block}\n    .result{margin-top:24px;padding-top:22px;border-top:1px solid var(--line)}.result[hidden]{display:none}.result-label{font-size:13px;color:var(--muted);font-weight:750;letter-spacing:.07em}.interest{display:flex;align-items:baseline;gap:9px;margin:6px 0}.interest .currency{font-size:18px;color:var(--blue);font-weight:900}.interest .amount{font-family:\"Noto Serif TC\",\"Songti TC\",serif;font-size:47px;line-height:1.1;color:var(--blue);font-weight:900;letter-spacing:-.035em}.interest .unit{font-weight:800;color:var(--gold)}\n    .summary{font-size:13px;color:var(--muted);line-height:1.65}.formula{margin-top:17px;padding:15px;border-radius:12px;background:var(--soft);font-size:13px;line-height:1.65}.formula strong{color:var(--blue)}\n    .breakdown{margin-top:15px;border:1px solid var(--line);border-radius:12px;overflow:hidden}.row{display:grid;grid-template-columns:65px 1fr auto;gap:10px;padding:11px 13px;font-size:12px;align-items:center}.row+.row{border-top:1px solid var(--line)}.row .year{font-weight:900;color:var(--blue)}.row .days{color:var(--muted)}.row .part{font-variant-numeric:tabular-nums;font-weight:750}\n    .copy{width:100%;margin-top:12px;padding:11px;border:1px solid var(--line);border-radius:11px;background:transparent;color:var(--blue);font:750 14px inherit;cursor:pointer}\n    .note{grid-column:1/-1;margin-top:4px;padding:17px 20px;border-left:4px solid var(--gold);border-radius:0 12px 12px 0;background:rgba(255,255,255,.6);font-size:13px;line-height:1.75;color:#576474}.note strong{color:var(--ink)}\n    .privacy{grid-column:1/-1;margin-top:14px;padding:18px 20px;border:1px solid #d8ddd9;background:rgba(255,255,255,.65);border-radius:14px;color:#576474;font-size:13px;line-height:1.75}\n    .privacy strong{color:var(--ink)}\n    .privacy h3{margin:0 0 8px;font-size:14px;color:var(--blue);font-weight:850}\n    .privacy p{margin:0 0 6px}.privacy p:last-child{margin-bottom:0}\n    .privacy code{background:#e9f1f6;padding:2px 5px;border-radius:4px;font-family:monospace;font-size:12px;color:var(--blue2)}\n    footer{display:flex;justify-content:space-between;gap:20px;margin-top:38px;padding-top:18px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}footer a{color:inherit}\n    @media(max-width:860px){main{grid-template-columns:1fr}.intro{padding-top:0}.laws{grid-template-columns:1fr 1fr}.calculator{max-width:620px;width:100%}.note{margin-top:0}}\n    @media(max-width:560px){.shell{width:min(100% - 22px,1120px);padding-top:20px}header{margin-bottom:28px}.back{display:none}h1{font-size:42px}.lead{font-size:16px}.laws{grid-template-columns:1fr}.dates{grid-template-columns:1fr}.calculator{padding:21px;border-radius:19px}.interest .amount{font-size:39px}.row{grid-template-columns:52px 1fr}.row .part{grid-column:2}footer{display:block;line-height:1.8}}\n  </style>\n</head>\n<body>\n  <div class=\"shell\">\n    <header>\n      <div class=\"brand\"><span class=\"mark\">息</span><span>臺灣法律計算工具</span></div>\n      <a class=\"back\" href=\"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001\" target=\"_blank\" rel=\"noreferrer\">查看民法原文 ↗</a>\n    </header>\n    <main>\n      <section class=\"intro\">\n        <p class=\"eyebrow\">STATUTORY DEFAULT INTEREST</p>\n        <div class=\"rate\">法定週年利率 <b>5%</b></div>\n        <h1>法定遲延<br>利息計算器</h1>\n        <p class=\"lead\">輸入本金、利息起算日與計算止日，即時計算期間內的法定遲延利息，並四捨五入至新臺幣元。</p>\n        <div class=\"laws\" aria-label=\"法律依據\">\n          <div class=\"law\"><strong>民法 § 203</strong><span>未約定利率且無其他法律依據時，週年利率為百分之五。</span></div>\n          <div class=\"law\"><strong>民法 § 233 I</strong><span>金錢債務遲延時，債權人得請求按法定利率計算的遲延利息。</span></div>\n        </div>\n      </section>\n\n      <section class=\"calculator\" aria-labelledby=\"calculator-title\">\n        <h2 id=\"calculator-title\" style=\"font-size:18px;margin:0 0 22px\">輸入計算資料</h2>\n        <div class=\"field\">\n          <label for=\"principal\">本金 <small>新臺幣</small></label>\n          <div class=\"money-wrap\"><input id=\"principal\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" placeholder=\"例如 1,000,000\"></div>\n        </div>\n        <div class=\"dates\">\n          <div class=\"field\"><label for=\"start\">利息起算日</label><input id=\"start\" type=\"date\"></div>\n          <div class=\"field\"><label for=\"end\">計算止日</label><input id=\"end\" type=\"date\"></div>\n        </div>\n        <button class=\"calculate\" id=\"calculate\" type=\"button\">計算遲延利息</button>\n        <div class=\"error\" id=\"error\" role=\"alert\"></div>\n\n        <div class=\"result\" id=\"result\" hidden aria-live=\"polite\">\n          <div class=\"result-label\">法定遲延利息</div>\n          <div class=\"interest\"><span class=\"currency\">NT$</span><span class=\"amount\" id=\"interest\"></span><span class=\"unit\">元</span></div>\n          <div class=\"summary\" id=\"summary\"></div>\n          <div class=\"formula\" id=\"formula\"></div>\n          <div class=\"breakdown\" id=\"breakdown\"></div>\n          <button class=\"copy\" id=\"copy\" type=\"button\">複製計算結果</button>\n        </div>\n      </section>\n\n      <aside class=\"note\"><strong>計算口徑：</strong>起算日與計算止日均計入。跨年度時，依各年度實際天數分段計算（平年 365 日、閏年 366 日），各段不先取整，合計後四捨五入至元。本工具適用未約定利率且無其他法律規定的情形；實際遲延起算日、清償日及適用利率，仍應依契約與個案法律關係確認。</aside>\n\n      <section class=\"privacy\" aria-label=\"隱私權與資料保護說明\">\n        <h3>隱私權與資料保護說明</h3>\n        <p><strong>計算資料不留存：</strong>本計算器為純前端本地即時運算工具，您所輸入的本金、利息起算日與計算止日，均僅在您的瀏覽器本機記憶體處理，伺服器絕不蒐集、傳輸或儲存任何計算參數或財務案件資料。</p>\n        <p><strong>匿名使用量統計：</strong>僅在您按下「計算遲延利息」且產出有效結果時，系統會記錄一次匿名使用事件。伺服器僅會記錄事件時間（台北時區）、經 HMAC-SHA256 雜湊處理之訪客識別碼（不留存原始 IP），以及遮罩處理後之電子郵件（如 <code>yu***@example.com</code>）。</p>\n        <p><strong>資料保存與目的：</strong>上述去識別化之統計數據僅保存最多 30 日，期滿自動刪除；僅用於每日產生使用量統計報告與系統維護，絕不移作其他用途。</p>\n      </section>\n    </main>\n    <footer><span>計算規則版本：2026.10</span><span>資料來源：<a href=\"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001\" target=\"_blank\" rel=\"noreferrer\">全國法規資料庫</a>・<a href=\"https://www.judicial.gov.tw/\" target=\"_blank\" rel=\"noreferrer\">司法院</a></span></footer>\n  </div>\n  <script>\n    const $=s=>document.querySelector(s);\n    const DAY=86400000;\n    const parseDate=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(Date.UTC(y,m-1,d));};\n    const dateKey=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;\n    const isLeap=y=>y%4===0&&(y%100!==0||y%400===0);\n    const daysInclusive=(a,b)=>Math.round((b-a)/DAY)+1;\n    const money=n=>new Intl.NumberFormat('zh-TW',{maximumFractionDigits:0}).format(n);\n    const exactMoney=n=>new Intl.NumberFormat('zh-TW',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);\n\n    function segments(start,end,principal){\n      const rows=[];\n      for(let y=start.getUTCFullYear();y<=end.getUTCFullYear();y++){\n        const a=y===start.getUTCFullYear()?start:new Date(Date.UTC(y,0,1));\n        const b=y===end.getUTCFullYear()?end:new Date(Date.UTC(y,11,31));\n        const days=daysInclusive(a,b), denominator=isLeap(y)?366:365;\n        rows.push({year:y,start:a,end:b,days,denominator,interest:principal*.05*days/denominator});\n      }\n      return rows;\n    }\n\n    function showError(message,fields=[]){\n      $('#error').textContent=message;$('#error').classList.add('show');$('#result').hidden=true;\n      ['principal','start','end'].forEach(id=>$('#'+id).removeAttribute('aria-invalid'));\n      fields.forEach(id=>$('#'+id).setAttribute('aria-invalid','true'));\n    }\n\n    function calculate(){\n      const raw=$('#principal').value.replace(/[,，\\s]/g,'');\n      const principal=Number(raw),startValue=$('#start').value,endValue=$('#end').value;\n      if(!raw||!Number.isFinite(principal)||principal<=0) return showError('請輸入大於 0 的本金。',['principal']);\n      if(!startValue||!endValue) return showError('請完整選擇利息起算日與計算止日。',[!startValue?'start':'',!endValue?'end':''].filter(Boolean));\n      const start=parseDate(startValue),end=parseDate(endValue);\n      if(end<start) return showError('計算止日不得早於利息起算日。',['start','end']);\n      $('#error').classList.remove('show');['principal','start','end'].forEach(id=>$('#'+id).removeAttribute('aria-invalid'));\n      const rows=segments(start,end,principal),total=rows.reduce((s,r)=>s+r.interest,0),rounded=Math.floor(total+0.5000000001),totalDays=daysInclusive(start,end);\n      $('#interest').textContent=money(rounded);\n      $('#summary').textContent=`本金 NT$ ${money(principal)}・計息 ${money(totalDays)} 日・週年利率 5%`;\n      $('#formula').innerHTML=rows.length===1\n        ? `<strong>計算式</strong><br>NT$ ${money(principal)} × 5% × ${rows[0].days} ÷ ${rows[0].denominator} ＝ NT$ ${exactMoney(total)} → <strong>NT$ ${money(rounded)}</strong>`\n        : `<strong>跨年度分段計算</strong><br>各年度利息合計 NT$ ${exactMoney(total)}，四捨五入為 <strong>NT$ ${money(rounded)}</strong>`;\n      $('#breakdown').innerHTML=rows.map(r=>`<div class=\"row\"><span class=\"year\">${r.year}</span><span class=\"days\">${dateKey(r.start)} ～ ${dateKey(r.end)}｜${r.days} ÷ ${r.denominator} 日</span><span class=\"part\">NT$ ${exactMoney(r.interest)}</span></div>`).join('');\n      $('#result').hidden=false;$('#result').scrollIntoView({behavior:'smooth',block:'nearest'});\n      try { fetch('/api/usage', { method: 'POST', keepalive: true }).catch(() => {}); } catch (_) {}\n    }\n\n    $('#principal').addEventListener('blur',e=>{const n=Number(e.target.value.replace(/[,，\\s]/g,''));if(Number.isFinite(n)&&n>0)e.target.value=new Intl.NumberFormat('zh-TW',{maximumFractionDigits:2}).format(n)});\n    $('#principal').addEventListener('focus',e=>{e.target.value=e.target.value.replace(/,/g,'')});\n    $('#calculate').addEventListener('click',calculate);\n    document.addEventListener('keydown',e=>{if(e.key==='Enter')calculate()});\n    $('#copy').addEventListener('click',async()=>{const text=`法定遲延利息計算\\n本金：NT$ ${$('#principal').value}\\n期間：${$('#start').value} 至 ${$('#end').value}（起迄日均計入）\\n利率：週年利率 5%\\n利息：NT$ ${$('#interest').textContent} 元`;await navigator.clipboard.writeText(text);$('#copy').textContent='已複製';setTimeout(()=>$('#copy').textContent='複製計算結果',1400)});\n  </script>\n</body>\n</html>\n";
const SITE_TITLE = "法定遲延利息計算器";

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
      `- **隱私保護說明**：本報告未紀錄或留存任何計算輸入（如本金、起算日與計算止日等），原始 IP 與使用者識別碼皆已雜湊，原始信箱已遮罩處理。`
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
