import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.indexOf('</script>'));

globalThis.document = {
  querySelector: () => ({ addEventListener() {}, classList: { add() {} } })
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
