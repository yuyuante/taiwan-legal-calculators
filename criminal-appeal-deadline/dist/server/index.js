const HTML_PAGE = "<!doctype html>\n<html lang=\"zh-Hant\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta name=\"description\" content=\"輸入刑事判決送達日，依刑事訴訟法第65、349條與民法第120、122條計算20日上訴期限。\">\n  <title>刑事上訴期限計算器</title>\n  <style>\n    :root {\n      --ink:#17201d; --muted:#65706c; --paper:#f7f5ef; --card:#fffefa;\n      --green:#1f5b49; --green2:#2f7660; --line:#d9ddd6; --gold:#b8873f;\n      --soft:#eaf2ee; --warn:#f8eee0;\n    }\n    *{box-sizing:border-box}\n    body{margin:0;color:var(--ink);background:\n      radial-gradient(circle at 82% 4%,rgba(184,135,63,.13),transparent 28rem),\n      linear-gradient(180deg,#f4f1e8 0,var(--paper) 48%,#eef2ee 100%);\n      font-family:\"Noto Sans TC\",\"PingFang TC\",\"Microsoft JhengHei\",sans-serif;min-height:100vh}\n    .shell{width:min(1080px,calc(100% - 32px));margin:auto;padding:34px 0 48px}\n    header{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px}\n    .brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.04em}\n    .seal{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--green);color:white;font-family:serif;font-size:18px}\n    .source-link{color:var(--green);font-size:14px;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px}\n    main{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(340px,.9fr);gap:42px;align-items:start}\n    .eyebrow{color:var(--green2);font-size:13px;font-weight:800;letter-spacing:.18em;margin:0 0 16px}\n    h1{font-family:\"Noto Serif TC\",\"Songti TC\",serif;font-size:clamp(42px,6vw,72px);line-height:1.04;letter-spacing:-.035em;margin:0 0 24px;max-width:720px}\n    .lead{font-size:18px;line-height:1.8;color:#4f5b57;max-width:590px;margin:0 0 34px}\n    .law-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n    .law{padding:16px 18px;background:rgba(255,255,255,.55);border:1px solid rgba(217,221,214,.9);border-radius:14px}\n    .law strong{display:block;font-family:serif;color:var(--green);margin-bottom:5px}\n    .law span{font-size:13px;line-height:1.55;color:var(--muted)}\n    .calculator{position:sticky;top:24px;background:var(--card);border:1px solid #e1e2dc;border-radius:24px;padding:28px;box-shadow:0 22px 70px rgba(42,57,50,.12)}\n    label{display:block;font-weight:800;margin-bottom:10px}\n    .input-wrap{position:relative}\n    input[type=date]{width:100%;height:58px;padding:0 16px;border:1.5px solid #bfc8c2;border-radius:13px;background:white;color:var(--ink);font:600 18px inherit;outline:none}\n    input[type=date]:focus{border-color:var(--green2);box-shadow:0 0 0 4px rgba(47,118,96,.12)}\n    .actions{display:flex;gap:10px;margin-top:12px}\n    button{border:0;border-radius:12px;font:700 15px inherit;cursor:pointer;transition:.18s ease}\n    #calculate{flex:1;padding:15px 18px;color:white;background:var(--green)}\n    #calculate:hover{background:#174a3b;transform:translateY(-1px)}\n    #today{padding:15px;background:var(--soft);color:var(--green)}\n    .result{margin-top:24px;padding-top:22px;border-top:1px solid var(--line)}\n    .result[hidden]{display:none}\n    .result-label{font-size:13px;color:var(--muted);font-weight:700;letter-spacing:.08em}\n    .deadline{display:flex;align-items:baseline;gap:12px;margin:7px 0 4px}\n    .deadline .date{font-family:\"Noto Serif TC\",\"Songti TC\",serif;font-size:38px;font-weight:900;color:var(--green);letter-spacing:-.04em}\n    .deadline .weekday{font-weight:800;color:var(--gold)}\n    .roc{color:var(--muted);font-size:14px}\n    .status{margin:18px 0 0;padding:13px 15px;border-radius:12px;background:var(--soft);font-size:14px;line-height:1.6}\n    .status.extended{background:var(--warn)}\n    .steps{display:grid;gap:0;margin-top:20px}\n    .step{position:relative;display:grid;grid-template-columns:28px 1fr;gap:10px;padding-bottom:14px;font-size:14px;color:var(--muted)}\n    .step:not(:last-child)::before{content:\"\";position:absolute;left:13px;top:23px;bottom:0;border-left:1px solid #cbd4cf}\n    .dot{display:grid;place-items:center;width:27px;height:27px;border-radius:50%;background:#e7eee9;color:var(--green);font-size:12px;font-weight:900}\n    .step strong{color:var(--ink);display:block;margin-bottom:2px}\n    .copy{display:none;width:100%;margin-top:6px;padding:11px;background:transparent;border:1px solid var(--line);color:var(--green)}\n    .copy.show{display:block}\n    .notice{grid-column:1/-1;margin-top:16px;padding:18px 20px;border-left:4px solid var(--gold);background:rgba(255,255,255,.62);border-radius:0 12px 12px 0;color:#56605d;font-size:13px;line-height:1.75}\n    .privacy{grid-column:1/-1;margin-top:14px;padding:18px 20px;border:1px solid rgba(217,221,214,.9);background:rgba(255,255,255,.62);border-radius:14px;color:#56605d;font-size:13px;line-height:1.75}\n    .privacy strong{color:var(--ink)}\n    .privacy h3{margin:0 0 8px;font-size:14px;color:var(--green);font-weight:800}\n    .privacy p{margin:0 0 6px}.privacy p:last-child{margin-bottom:0}\n    .privacy code{background:#e7eee9;padding:2px 5px;border-radius:4px;font-family:monospace;font-size:12px;color:var(--green2)}\n    footer{display:flex;justify-content:space-between;gap:20px;margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}\n    footer a{color:inherit}\n    @media(max-width:820px){header{margin-bottom:32px} main{grid-template-columns:1fr;gap:30px}.calculator{position:static}.law-grid{grid-template-columns:1fr 1fr}h1{font-size:48px}.notice{margin-top:0}}\n    @media(max-width:520px){.shell{width:min(100% - 22px,1080px);padding-top:22px}header{margin-bottom:30px}.brand span:last-child{font-size:14px}.source-link{display:none}h1{font-size:40px}.lead{font-size:16px}.law-grid{grid-template-columns:1fr}.calculator{padding:21px;border-radius:19px}.deadline .date{font-size:31px}footer{display:block;line-height:1.7}}\n  </style>\n</head>\n<body>\n  <div class=\"shell\">\n    <header>\n      <div class=\"brand\"><span class=\"seal\">法</span><span>刑事程序小工具</span></div>\n      <a class=\"source-link\" href=\"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0010001\" target=\"_blank\" rel=\"noreferrer\">查看法規原文 ↗</a>\n    </header>\n    <main>\n      <section>\n        <p class=\"eyebrow\">CRIMINAL APPEAL DEADLINE</p>\n        <h1>刑事上訴<br>期限計算器</h1>\n        <p class=\"lead\">輸入判決書送達日，立即算出 20 日上訴期間的最後一天。送達當日不計入；末日遇休息日，順延至下一個上班日。</p>\n        <div class=\"law-grid\" aria-label=\"計算依據\">\n          <div class=\"law\"><strong>刑訴 § 349</strong><span>上訴期間為二十日，自送達判決後起算。</span></div>\n          <div class=\"law\"><strong>刑訴 § 65</strong><span>期間的計算，依民法規定。</span></div>\n          <div class=\"law\"><strong>民法 § 120 II</strong><span>以日定期間，始日不算入。</span></div>\n          <div class=\"law\"><strong>民法 § 122</strong><span>末日為休息日，以次日代之。</span></div>\n        </div>\n      </section>\n\n      <section class=\"calculator\" aria-labelledby=\"calc-title\">\n        <label id=\"calc-title\" for=\"served\">判決書送達日</label>\n        <div class=\"input-wrap\"><input id=\"served\" type=\"date\" aria-describedby=\"date-help\"></div>\n        <div class=\"actions\">\n          <button id=\"calculate\" type=\"button\">計算上訴期限</button>\n          <button id=\"today\" type=\"button\">今天</button>\n        </div>\n        <div id=\"date-help\" style=\"margin-top:9px;font-size:12px;color:var(--muted)\">以實際合法送達的日期為準</div>\n\n        <div class=\"result\" id=\"result\" hidden aria-live=\"polite\">\n          <div class=\"result-label\">最晚應於此日前提起上訴</div>\n          <div class=\"deadline\"><span class=\"date\" id=\"deadline\"></span><span class=\"weekday\" id=\"weekday\"></span></div>\n          <div class=\"roc\" id=\"roc\"></div>\n          <div class=\"status\" id=\"status\"></div>\n          <div class=\"steps\" id=\"steps\"></div>\n          <button class=\"copy\" id=\"copy\" type=\"button\">複製計算結果</button>\n        </div>\n      </section>\n\n      <aside class=\"notice\">\n        <strong>使用前請留意：</strong>本工具依政府行政機關休假規則計算，並已核對 2026、2027 年官方辦公日曆；不含在途期間、個案送達效力、天然災害停止上班或臨時公告。期限具有重大法律效果，請以法院通知及承辦法院確認結果為準。\n      </aside>\n\n      <section class=\"privacy\" aria-label=\"隱私權與資料保護說明\">\n        <h3>隱私權與資料保護說明</h3>\n        <p><strong>計算資料不留存：</strong>本計算器為純前端本地即時運算工具，您所輸入的判決送達日及計算出之上訴期限，均僅在您的瀏覽器本機記憶體處理，伺服器絕不蒐集、傳輸或儲存任何計算內容或個案資料。</p>\n        <p><strong>匿名使用量統計：</strong>僅在您按下「計算上訴期限」且產出有效結果時，系統會記錄一次匿名使用事件。伺服器僅會記錄事件時間（台北時區）、經 HMAC-SHA256 雜湊處理之訪客識別碼（不留存原始 IP），以及遮罩處理後之電子郵件（如 <code>yu***@example.com</code>）。</p>\n        <p><strong>資料保存與目的：</strong>上述去識別化之統計數據僅保存最多 30 日，期滿自動刪除；僅用於每日產生使用量統計報告與系統維護，絕不移作其他用途。</p>\n      </section>\n    </main>\n    <footer>\n      <span>計算規則版本：2026.10</span>\n      <span>資料來源：<a href=\"https://www.judicial.gov.tw/tw/cp-1303-2649-ea28a-1.html\" target=\"_blank\" rel=\"noreferrer\">司法院</a>・<a href=\"https://www.dgpa.gov.tw/informationlist?uid=30\" target=\"_blank\" rel=\"noreferrer\">行政院人事行政總處</a></span>\n    </footer>\n  </div>\n\n  <script>\n    const $ = s => document.querySelector(s);\n    const DAY = 86400000;\n    const pad = n => String(n).padStart(2,'0');\n    const key = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;\n    const fromKey = s => { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d,12); };\n    const add = (d,n) => new Date(d.getFullYear(),d.getMonth(),d.getDate()+n,12);\n    const fmt = d => `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`;\n    const weekday = d => ['日','一','二','三','四','五','六'][d.getDay()];\n\n    // 2025–2035 清明日期；其餘年度採 4/5 並提示人工確認。\n    const qingming = {2025:'04-04',2026:'04-05',2027:'04-05',2028:'04-04',2029:'04-04',2030:'04-05',2031:'04-05',2032:'04-04',2033:'04-04',2034:'04-05',2035:'04-05'};\n    const officialDays = {\n      2026: {\n        '01-01':'開國紀念日','02-16':'春節假期','02-17':'春節','02-18':'春節','02-19':'春節','02-20':'春節補假',\n        '02-27':'和平紀念日補假','04-03':'兒童節補假','04-06':'清明節補假','05-01':'勞動節','06-19':'端午節',\n        '09-25':'中秋節','09-28':'教師節','10-09':'國慶日補假','10-26':'臺灣光復節補假','12-25':'行憲紀念日'\n      },\n      2027: {\n        '01-01':'開國紀念日','02-04':'春節假期','02-05':'除夕','02-08':'春節','02-09':'春節補假','02-10':'春節補假',\n        '03-01':'和平紀念日補假','04-05':'清明節','04-06':'兒童節補假','04-30':'勞動節補假','06-09':'端午節',\n        '09-15':'中秋節','09-28':'教師節','10-11':'國慶日補假','10-25':'臺灣光復節','12-24':'行憲紀念日補假','12-31':'次年開國紀念日補假'\n      }\n    };\n\n    function lunarDateMap(year){\n      const f = new Intl.DateTimeFormat('en-u-ca-chinese',{month:'numeric',day:'numeric'});\n      const found = {};\n      for(let d=new Date(year-1,11,20,12); d<=new Date(year,11,31,12); d=add(d,1)){\n        const parts=f.formatToParts(d); const m=parts.find(x=>x.type==='month')?.value; const day=parts.find(x=>x.type==='day')?.value;\n        if(m && day && !String(m).includes('bis')) found[`${m}/${day}`]=new Date(d);\n      }\n      return found;\n    }\n\n    function holidayCalendar(year){\n      if(officialDays[year]){\n        return new Map(Object.entries(officialDays[year]).map(([md,name])=>[`${year}-${md}`,name]));\n      }\n      const actual = new Map();\n      const put=(d,name)=>actual.set(key(d),name);\n      const fixed=[['01-01','開國紀念日'],['02-28','和平紀念日'],['04-04','兒童節'],['05-01','勞動節'],['09-28','教師節'],['10-10','國慶日'],['10-25','臺灣光復暨金門古寧頭大捷紀念日'],['12-25','行憲紀念日']];\n      fixed.forEach(([md,n])=>put(fromKey(`${year}-${md}`),n));\n      put(fromKey(`${year}-${qingming[year]||'04-05'}`),'清明節');\n      const lunar=lunarDateMap(year);\n      if(lunar['1/1']){\n        const eve=add(lunar['1/1'],-1);\n        put(add(eve,-1),'春節假期'); put(eve,'除夕');\n        [0,1,2].forEach((n,i)=>put(add(lunar['1/1'],n),`春節初${['一','二','三'][i]}`));\n      }\n      if(lunar['5/5']) put(lunar['5/5'],'端午節');\n      if(lunar['8/15']) put(lunar['8/15'],'中秋節');\n\n      const closed=new Map(actual);\n      const weekendActual=[...actual.entries()].map(([k,n])=>[fromKey(k),n]).filter(([d])=>d.getDay()===0||d.getDay()===6).sort((a,b)=>a[0]-b[0]);\n      for(const [d,n] of weekendActual){\n        // 除夕、春節遇週末依規則一律向後補假；其他節日週六前補、週日後補。\n        const direction=/春節|除夕/.test(n) ? 1 : (d.getDay()===6?-1:1);\n        let observed=add(d,direction), guard=0;\n        while((observed.getDay()===0||observed.getDay()===6||closed.has(key(observed))) && guard++<14) observed=add(observed,direction);\n        closed.set(key(observed),`${n}補假`);\n      }\n      return closed;\n    }\n\n    const cache={};\n    function reason(d){\n      if(d.getDay()===0||d.getDay()===6) return `星期${weekday(d)}`;\n      for(const y of [d.getFullYear()-1,d.getFullYear(),d.getFullYear()+1]){\n        cache[y] ||= holidayCalendar(y);\n        if(cache[y].has(key(d))) return cache[y].get(key(d));\n      }\n      return '';\n    }\n\n    function calculate(){\n      const value=$('#served').value;\n      if(!value){ $('#served').focus(); $('#served').setAttribute('aria-invalid','true'); return; }\n      $('#served').removeAttribute('aria-invalid');\n      const served=fromKey(value), first=add(served,1), day20=add(served,20);\n      let due=new Date(day20), skipped=[];\n      while(reason(due) && skipped.length<14){ skipped.push(`${fmt(due)}（${reason(due)}）`); due=add(due,1); }\n      $('#deadline').textContent=fmt(due);\n      $('#weekday').textContent=`星期${weekday(due)}`;\n      $('#roc').textContent=`民國 ${due.getFullYear()-1911} 年 ${due.getMonth()+1} 月 ${due.getDate()} 日`;\n      const extended=skipped.length>0;\n      $('#status').className='status'+(extended?' extended':'');\n      $('#status').innerHTML=extended\n        ? `原末日遇到休息日，已順延 <strong>${skipped.length} 日</strong>至下一個上班日。`\n        : `第 20 日為上班日，<strong>無須順延</strong>。`;\n      $('#steps').innerHTML=`\n        <div class=\"step\"><span class=\"dot\">1</span><div><strong>送達日不計</strong>${fmt(served)}（星期${weekday(served)}）</div></div>\n        <div class=\"step\"><span class=\"dot\">2</span><div><strong>第 1 日</strong>${fmt(first)}（星期${weekday(first)}）起算</div></div>\n        <div class=\"step\"><span class=\"dot\">20</span><div><strong>第 20 日</strong>${fmt(day20)}（星期${weekday(day20)}）${extended?'，遇 '+reason(day20):''}</div></div>\n        ${extended?`<div class=\"step\"><span class=\"dot\">✓</span><div><strong>順延後末日</strong>${skipped.join('、')} → ${fmt(due)}</div></div>`:''}`;\n      $('#result').hidden=false; $('#copy').classList.add('show');\n      $('#result').scrollIntoView({behavior:'smooth',block:'nearest'});\n      try { fetch('/api/usage', { method: 'POST', keepalive: true }).catch(() => {}); } catch (_) {}\n    }\n\n    $('#calculate').addEventListener('click',calculate);\n    $('#served').addEventListener('keydown',e=>{if(e.key==='Enter')calculate()});\n    $('#served').addEventListener('change',()=>{if($('#served').value)calculate()});\n    $('#today').addEventListener('click',()=>{$('#served').value=key(new Date());calculate()});\n    $('#copy').addEventListener('click',async()=>{\n      const text=`刑事判決送達日：${$('#served').value}\\n上訴期限末日：${$('#deadline').textContent}（${$('#weekday').textContent}）\\n※ 不含在途期間，請以法院確認為準。`;\n      await navigator.clipboard.writeText(text); $('#copy').textContent='已複製'; setTimeout(()=>$('#copy').textContent='複製計算結果',1400);\n    });\n  </script>\n</body>\n</html>\n";
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
