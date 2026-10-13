// Copy ONLY the user's example magazine into LOCAL preview if it is missing.
// All production requests are GET; existing local records/media are never overwritten.
import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
const slug='investment-in-iraq-perspectives-2027';
const origin='https://www.emaalbs.com';
const proxy=await getPlatformProxy({remoteBindings:false});
try {
  const db=proxy.env.DB;
  if(await db.prepare('SELECT id FROM magazines WHERE slug=?').bind(slug).first()) {
    console.log('Existing local example preserved; nothing imported.');
  } else {
    const response=await fetch(`${origin}/api/magazines/${slug}`,{signal:AbortSignal.timeout(30000)});
    assert.equal(response.status,200);
    const item=await response.json();assert.equal(item.slug,slug);
    for(const path of [item.cover_image,item.pdf_url]) {
      assert.ok(typeof path==='string'&&path.startsWith('/api/media/'));
      const key=decodeURIComponent(path.slice('/api/media/'.length));
      if(await proxy.env.MEDIA.head(key)) continue;
      const media=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(60000)});
      assert.equal(media.status,200);
      assert.ok(Number(media.headers.get('content-length'))<=50*1024*1024,'preview file size limit');
      const chunks=[];let size=0;
      for await(const chunk of media.body){size+=chunk.length;assert.ok(size<=50*1024*1024);chunks.push(chunk);}
      await proxy.env.MEDIA.put(key,Uint8Array.from(Buffer.concat(chunks)).buffer,{httpMetadata:{contentType:media.headers.get('content-type')||'application/octet-stream'}});
      console.log('Copied local media:',key,'bytes:',size);
    }
    const now=Date.now();
    await db.prepare(`INSERT OR IGNORE INTO magazines(slug,title_en,title_ar,description_en,description_ar,cover_image,pdf_url,pdf_url_en,pdf_url_ar,date,published,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,1,?,?)`)
      .bind(slug,item.title.en,item.title.ar,item.description.en,item.description.ar,item.cover_image,item.pdf_url,'','',item.date,now,now).run();
    console.log('Example copied to local D1; production unchanged.');
  }
} finally {await proxy.dispose();}
