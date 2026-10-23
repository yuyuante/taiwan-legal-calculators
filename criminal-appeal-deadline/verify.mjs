import fs from 'node:fs';
import assert from 'node:assert/strict';

// 1. Verify calculation logic from dist/index.html
const html = fs.readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.indexOf('</script>'));

globalThis.document = {
  querySelector: () => ({ addEventListener() {}, classList: { add() {} }, scrollIntoView() {} })
};
const checks = `
  function testDue(servedKey){
    let due=add(fromKey(servedKey),20);
    while(reason(due)) due=add(due,1);
    return key(due);
  }
  assert.equal(testDue('2026-09-08'),'2026-09-29'); // 第20日為教師節
  assert.equal(testDue('2026-09-20'),'2026-10-12'); // 國慶連假後首個上班日
  assert.equal(testDue('2026-12-05'),'2026-12-28'); // 行憲紀念日及週末
  assert.equal(testDue('2027-01-17'),'2027-02-11'); // 春節及補假結束後
`;

new Function('assert', script + checks)(assert);
console.log('4 deadline cases passed');

// 2. Verify privacy notice exists in HTML
assert.ok(html.includes('隱私權與資料保護說明'), 'HTML must contain privacy notice');
assert.ok(html.includes('/api/usage'), 'HTML must ping /api/usage');
console.log('Privacy notice and usage ping verified in HTML');

// 3. Verify Worker endpoints & functions
const workerPath = new URL('./dist/server/index.js', import.meta.url);
const workerSource = fs.readFileSync(workerPath, 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`;
const workerModule = await import(moduleUrl);
const worker = workerModule.default;

// Test GET /
const getReq = new Request('https://criminal-appeal-deadline.sweetring4097.chatgpt.site/');
const getRes = await worker.fetch(getReq, {}, {});
assert.equal(getRes.status, 200);
const bodyText = await getRes.text();
assert.ok(bodyText.includes('刑事上訴期限計算器'));
assert.ok(bodyText.includes('隱私權與資料保護說明'));
console.log('Worker GET / passed');

// Test email masking
assert.equal(workerModule.maskEmail('yuyuante+chatgpt.site@gmail.com'), 'yu***@gmail.com');
assert.equal(workerModule.maskEmail('a@test.com'), 'a***@test.com');
assert.equal(workerModule.maskEmail(null), null);
console.log('Email masking verified');

// Test HMAC SHA-256
const hash1 = await workerModule.hmacSha256('user:123', 'secret-key');
const hash2 = await workerModule.hmacSha256('user:123', 'secret-key');
const hash3 = await workerModule.hmacSha256('user:456', 'secret-key');
assert.equal(hash1, hash2, 'HMAC must be deterministic');
assert.notEqual(hash1, hash3, 'HMAC must differ for different inputs');
console.log('HMAC SHA-256 verified');

// Test POST /api/usage with mock D1 DB
const insertedRows = [];
const deletedQueries = [];
const mockDb = {
  prepare(sql) {
    return {
      bind(...args) {
        return {
          async run() {
            if (sql.startsWith('INSERT')) {
              insertedRows.push({ sql, args });
            } else if (sql.startsWith('DELETE')) {
              deletedQueries.push({ sql, args });
            }
            return { success: true };
          }
        };
      }
    };
  }
};

const usageReq = new Request('https://criminal-appeal-deadline.sweetring4097.chatgpt.site/api/usage', {
  method: 'POST',
  headers: {
    'oai-authenticated-user-id': 'usr_test123',
    'oai-authenticated-user-email': 'test@example.com'
  }
});
const usageRes = await worker.fetch(usageReq, { DB: mockDb, ANALYTICS_HASH_KEY: 'test-key' }, {});
assert.equal(usageRes.status, 200);
assert.equal(insertedRows.length, 1);
assert.equal(insertedRows[0].args[3], 'te***@example.com');
assert.equal(deletedQueries.length, 1);
console.log('Worker POST /api/usage passed (insert + 30-day retention query)');

// Test POST /mcp (server/discover, tools/list, tools/call)
const discoverReq = new Request('https://criminal-appeal-deadline.sweetring4097.chatgpt.site/mcp', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'server/discover' })
});
const discoverRes = await worker.fetch(discoverReq, {}, {});
const discoverJson = await discoverRes.json();
assert.equal(discoverJson.result.protocolVersion, '2026-07-28');
console.log('MCP server/discover passed');

const listReq = new Request('https://criminal-appeal-deadline.sweetring4097.chatgpt.site/mcp', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
});
const listRes = await worker.fetch(listReq, {}, {});
const listJson = await listRes.json();
assert.equal(listJson.result.tools[0].name, 'get_daily_usage_summary');
console.log('MCP tools/list passed');

// Test tools/call with mock DB returning stats
const mockMcpDb = {
  prepare(sql) {
    return {
      bind(...args) {
        return {
          async first() {
            return { total_count: 42, user_count: 5 };
          },
          async all() {
            return { results: [{ masked_email: 'te***@example.com', cnt: 12 }] };
          }
        };
      }
    };
  }
};

const callReq = new Request('https://criminal-appeal-deadline.sweetring4097.chatgpt.site/mcp', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_daily_usage_summary',
      arguments: { date: '2026-10-23' }
    }
  })
});
const callRes = await worker.fetch(callReq, { DB: mockMcpDb }, {});
const callJson = await callRes.json();
const textContent = callJson.result.content[0].text;
assert.ok(textContent.includes('42 次'));
assert.ok(textContent.includes('5 人'));
assert.ok(textContent.includes('te***@example.com'));
console.log('MCP tools/call passed');

console.log('All criminal-appeal-deadline tests passed successfully!');
