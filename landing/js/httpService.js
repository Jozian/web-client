window.sendRequest = (function() {

  return function sendRequest(requestData) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open(requestData.method, requestData.url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

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