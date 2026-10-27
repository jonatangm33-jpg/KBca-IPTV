var CACHE = 'leitor-iptv-v3';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (f) { return c.add(f).catch(function () {}); }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(function () { return caches.match('./index.html'); }));
    return;
  }

  var path = url.pathname;
  var isShell = SHELL.some(function (p) {
    var clean = p.replace('./', '/');
    return path === clean || path.endsWith(clean);
  });
  if (!isShell) return;

  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {});
      return res;
    }).catch(function () { return caches.match(req); })
  );
});
