!(function () {
  function e(t, e) {
    return 'function' != typeof t || t.replaced ? t : ((e.replaced = !0), e);
  }
  var n,
    r,
    o,
    u = 0;
  if (
    'undefined' != typeof CustomEvent &&
    'function' == typeof window.dispatchEvent
  ) {
    function s(t) {
      try {
        if (
          ('object' == typeof t && (t = JSON.stringify(t)),
          'string' == typeof t)
        )
          return (
            window.dispatchEvent(
              new CustomEvent('lprequeststart', {
                detail: {
                  data: t,
                  requestID: ++u,
                },
              })
            ),
            u
          );
      } catch (t) {}
    }
    function c(t) {
      try {
        window.dispatchEvent(
          new CustomEvent('lprequestend', {
            detail: t,
          })
        );
      } catch (t) {}
    }
    'undefined' != typeof XMLHttpRequest &&
      XMLHttpRequest.prototype &&
      XMLHttpRequest.prototype.send &&
      (XMLHttpRequest.prototype.send = e(
        XMLHttpRequest.prototype.send,
        ((o = XMLHttpRequest.prototype.send),
        function (t) {
          var e = this,
            n = s(t);
          return (
            n &&
              e.addEventListener('loadend', function () {
                c({
                  requestID: n,
                  statusCode: e.status,
                });
              }),
            o.apply(e, arguments)
          );
        })
      )),
      'function' == typeof fetch &&
        (fetch = e(
          fetch,
          ((r = fetch),
          function (t, e) {
            var n = s(e),
              o = r.apply(this, arguments);
            if (n) {
              function u(t) {
                c({
                  requestID: n,
                  statusCode: t && t.status,
                });
              }
              o.then(u).catch(u);
            }
            return o;
          })
        ));
    function i(t) {
      return e(t, function () {
        try {
          this.dispatchEvent(new CustomEvent('lpsubmit'));
        } catch (t) {}
        return t.apply(this, arguments);
      });
    }
    function t() {
      if (document && document.forms && 0 < document.forms.length)
        for (var t = 0; t < document.forms.length; ++t)
          document.forms[t].submit = i(document.forms[t].submit);
    }
    (document && 'interactive' === document.readyState) ||
    'complete' === document.readyState
      ? t()
      : window.addEventListener('DOMContentLoaded', t, !0),
      (Document.prototype.createElement = e(
        Document.prototype.createElement,
        ((n = Document.prototype.createElement),
        function () {
          var t = n.apply(this, arguments);
          return (
            t && 'FORM' === t.nodeName && t.submit && (t.submit = i(t.submit)),
            t
          );
        })
      ));
  }
})();
