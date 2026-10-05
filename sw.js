const CACHE='dumpling-land-7794f75a6f';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).then(()=>c.add('https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js').catch(()=>{}))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>req.mode==='navigate'?c.match('index.html'):Response.error()))));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com$|^cdnjs\.cloudflare\.com$/.test(url.hostname)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>{const net=fetch(req).then(r=>{c.put(req,r.clone());return r}).catch(()=>hit);return hit||net})));
  }
});
