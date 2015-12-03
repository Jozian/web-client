window.sendRequest = (function() {

  function _getXmlHttp() {
    var xmlhttp;
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof XMLHttpRequest !== 'undefined') {
      xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
  }

  return function sendRequest(requestData) {
    var xmlhttp = _getXmlHttp();

    xmlhttp.open(requestData.method, requestData.url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {

          requestData.complete(xmlhttp.response);
        } else {
          requestData.error(xmlhttp);
        }
      }
    };

    xmlhttp.send(JSON.stringify(requestData.body));
  }
})();