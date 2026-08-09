// Trata o redirecionamento do 404.html para SPAs no GitHub Pages
(function() {
  var q = window.location.search;
  if (q && q.indexOf('?p=/') !== -1) {
    var match = q.match(/\?p=([^&]*)/);
    if (match && match[1]) {
      var decoded = decodeURIComponent(match[1]);
      window.history.replaceState(null, '', window.location.pathname + decoded + (window.location.hash || ''));
    }
  }
})();
