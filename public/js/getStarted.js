(function() {
  window.onload = function() {
    var allIdElem = [];
    allIdElem.push(document.getElementById('getStarted'));
    allIdElem.push(document.getElementById('useCases'));
    allIdElem.push(document.getElementById('openSource'));
    allIdElem.push(document.getElementById('support'));

    var allElemMenu = document.querySelectorAll('.b_start-header-menu > li > a');

    function selectBlock(name, number) {
      for (var i = 0; i < allIdElem.length; i++) {
        allIdElem[i].style.display = 'none';
      }

      for (var j = 0; j < allElemMenu.length; j++) {
        allElemMenu[j].classList.remove('b_start-header-menu--selected');
      }

      allElemMenu[number].classList.add('b_start-header-menu--selected');
      document.getElementById(name).style.display = 'block';
      window.scrollTo(0, 0);
    }

    selectBlock('getStarted', 0);
    
    window.addEventListener('hashchange', function(event) {
      event.preventDefault();
      switch (location.hash.substring(1)) {
      case 'getStarted':
        selectBlock('getStarted', 0);
        break;
      case 'useCases':
        selectBlock('useCases', 1);
        break;
      case 'openSource':
        selectBlock('openSource', 2);
        break;
      case 'support':
        selectBlock('support', 3);
        break;
      default:
        break;
      }
    });
  };
})();
