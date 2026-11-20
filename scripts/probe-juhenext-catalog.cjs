// Read-only network discovery for the browser-loaded website catalog.
// Run in CI to identify the actual automatic catalog data request on page refresh.
// Never log response credentials or unfiltered JSON bodies.
const { chromium } = require('playwright');

const origin = 'https://www.juhenext.com/models/';
const MAX_INSPECT = 6_000_000;
const hits = [];

function displayUrl(raw) {
  try {
    const u = new URL(raw);
    if (!/^https:$/.test(u.protocol)) return null;
    return u.origin + u.pathname; // avoid exposing any query credentials
  } catch { return null; }
}

function summarize(payload) {
  if (Array.isArray(payload)) {
    const first = payload.find((v) => v && typeof v === 'object') || payload[0];
    return { kind:'array', count:payload.length, fields:first && typeof first === 'object' ? Object.keys(first).slice(0,16) : [], sampleId:typeof first === 'string' ? first.slice(0,100) : String(first?.id || first?.model_id || first?.name || '').slice(0,100) };
  }
  if (!payload || typeof payload !== 'object') return { kind: typeof payload };
  const keys = Object.keys(payload).slice(0,25);
  const candidates = [];
  const queue = [{ value:payload, path:'root', depth:0 }];
  while (queue.length) {
    const {value,path,depth}=queue.shift();
    if (Array.isArray(value)) {
      if (value.length >= 10) candidates.push({path,count:value.length,fields:value[0] && typeof value[0] === 'object' ? Object.keys(value[0]).slice(0,15) : [],sampleId:typeof value[0] === 'string' ? value[0].slice(0,80) : String(value[0]?.id || value[0]?.modelId || value[0]?.name || '').slice(0,80)});
    } else if (depth < 3 && value && typeof value === 'object') {
      for (const [k,v] of Object.entries(value).slice(0,40)) {
        if (v && typeof v === 'object') queue.push({value:v,path:path+'.'+k,depth:depth+1});
      }
    }
  }
  return {kind:'object',keys,candidates:candidates.slice(0,8)};
}

async function main() {
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
  try {
    const page=await browser.newPage({viewport:{width:1360,height:900},ignoreHTTPSErrors:false});
    const pending=[];
    page.on('response',(response)=>{
      const url=displayUrl(response.url());
      if (!url || !url.startsWith('https://')) return;
      const headers=response.headers();
      const type=headers['content-type']||'';
      const looksLikeCatalog=/catalog|model|pricing|data|list|export|json/i.test(new URL(url).pathname);
      if (!looksLikeCatalog && !/json/.test(type)) return;
      pending.push((async()=>{
        const row={url,code:response.status(),type:type.split(';')[0]};
        try {
          if (/json|text\/plain|application\/octet-stream/.test(type)) {
            const body=await response.body();
            row.bytes=body.length;
            if(body.length < MAX_INSPECT) {
              const raw=body.toString('utf8');
              try {row.data=summarize(JSON.parse(raw));}
              catch { row.firstChars=raw.slice(0,80).replace(/[<>]/g,'');}
            }
          }
        } catch(error) {row.note=String(error).slice(0,100);}
        hits.push(row);
      })());
    });
    for (let i=0;i<2;i++){
      try {
        const response=i===0?await page.goto(origin,{waitUntil:'domcontentloaded',timeout:25000}):await page.reload({waitUntil:'domcontentloaded',timeout:25000});
        console.log('CATALOG_PROBE_PAGE',i+1,{status:response?.status(),url:displayUrl(page.url())});
        await page.waitForTimeout(12000);
        console.log('CATALOG_PROBE_TEXT', (await page.locator('body').innerText()).slice(0,230).replace(/\s+/g,' '));
      }catch(error){console.log('CATALOG_PROBE_NAV_ERROR',i+1,String(error).slice(0,260));}
    }
    await Promise.allSettled(pending);
    const seen=new Set();
    for(const row of hits){
      const key=row.url+'|'+row.code+'|'+row.bytes;
      if(seen.has(key))continue;
      seen.add(key);
      console.log('CATALOG_PROBE_RESPONSE',JSON.stringify(row));
    }
    console.log('CATALOG_PROBE_SUMMARY',{uniqueResponses:seen.size,totalResponses:hits.length});
  } finally {await browser.close();}
}
main().catch(error=>{console.error('CATALOG_PROBE_ERROR',String(error));process.exitCode=1;});
