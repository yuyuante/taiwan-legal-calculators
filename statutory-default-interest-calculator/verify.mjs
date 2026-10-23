import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
globalThis.document={querySelector:()=>({addEventListener(){},classList:{add(){},remove(){}},removeAttribute(){},setAttribute(){}}),addEventListener(){}};
const checks=`
  const calc=(p,s,e)=>segments(parseDate(s),parseDate(e),p).reduce((n,r)=>n+r.interest,0);
  assert.equal(Math.floor(calc(100000,'2023-01-01','2023-12-31')+.5),5000);
  assert.equal(Math.floor(calc(100000,'2024-01-01','2024-12-31')+.5),5000);
  assert.equal(Math.floor(calc(100000,'2024-01-01','2024-01-01')+.5),14);
  assert.equal(Math.floor(calc(100000,'2023-12-31','2024-01-01')+.5),27);
`;
new Function('assert',script+checks)(assert);
console.log('4 interest cases passed');
