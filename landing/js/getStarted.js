(function() {

  if (window.localStorage.getItem('MEDtoken') && window.localStorage.getItem('MEDuser')) {
    window.location.href = '/admin/';
  }
  window.addEventListener('load', function() {
    var allIdElem = [];
    allIdElem.push(document.getElementById('getStarted'));
    allIdElem.push(document.getElementById('useCases'));
    allIdElem.push(document.getElementById('openSource'));
    allIdElem.push(document.getElementById('support'));

    allIdElem.push(document.getElementById('loginRegister'));
    var baseUrl = 'http://medserver.apps.wookieelabs.com';

    var forgotPasswordTemplate = document.getElementById('forgotPasswordTpl').innerHTML;

    var resetPasswordTemplate = document.getElementById('changePasswordTpl').innerHTML;

    var succesRegistrationTemplate = document.getElementById('succesRegistrationTpl').innerHTML;

    var bodyElem = document.body;

    var getLoginForm = document.getElementById('login-form');
    var getRegistrationForm = document.getElementById('register-form');

    var forgotPassword = document.getElementById('forgot-pass');

    var loginErr = document.getElementById('login_err');
    var registerErr = document.getElementById('reg_err');

    var allElemMenu = document.querySelectorAll('.b_start-header-menu > li > a');

    var mnuIdx = {
      getStarted: '0',
      useCases: 1,
      openSource: 2,
      support: 3,
      loginRegister: 4,
    };

    function selectBlock(name, number) {
      for (var i = 0; i < allIdElem.length; i++) {
        allIdElem[i].style.display = 'none';
      }

      for (var j = 0; j < allElemMenu.length; j++) {
        allElemMenu[j].classList.remove('b_start-header-menu--selected');
      }
      
      document.getElementById(name).style.display = 'block';
      window.scrollTo(0, 0);

      if (number === 4) {
        return;
      }

      allElemMenu[number].classList.add('b_start-header-menu--selected');

    }

    window.addEventListener('hashchange', function (event) {
      event.preventDefault();
      var currentHash = location.hash.substring(1);

      if (mnuIdx[currentHash]) {
        selectBlock(currentHash, mnuIdx[currentHash]);
      }
    });

    if (window.location.hash.indexOf('#token') !== -1) {
      openModalWindow(resetPasswordTemplate, bodyElem);

      var resetPasswordForm = document.getElementById('reset-password-form');

      resetPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var confirmErr = document.getElementById('confirm_err');
        if (event.target.password.value === event.target.confirmPassword.value) {
          confirmErr.classList.add('hidden');
          sendRequest({
            method: 'POST',
            url: baseUrl + '/api/auth/passwordRecovery/',
            body: {
              newPass: event.target.password.value,
              token: window.location.hash.substr(1),
            },
            complete: function (res) {
              closeModalWindow();
              window.location.hash = '#loginRegister';
            },
            error: function (err) {
              expiredErr.classList.remove('hidden');
              console.log(err.statusText);
            },
          });
        } else {
          confirmErr.classList.remove('hidden');
        }

      });
    } else if (window.location.hash) {
      var currentHash = window.location.hash.substr(1);
      if (mnuIdx[currentHash]) {
        selectBlock(currentHash, mnuIdx[currentHash]);
      }
    } else {
      window.location.hash = '#getStarted';
    }

    forgotPassword.addEventListener('click', function (e) {
      e.preventDefault();
      openModalWindow(forgotPasswordTemplate, bodyElem);
      document.querySelector('.b_error_msg--email-incorrect').classList.add('hidden');
      var forgotPasswordRecovery = document.getElementById('password-recovery-form');
      forgotPasswordRecovery.addEventListener('submit', function (e) {
        sendRequest({
          method: 'PUT',
          url: baseUrl + '/api/auth/passwordRecovery/' + e.target.email.value,

          complete: function (request) {
            closeModalWindow();
          },
          error: function (err) {
            document.querySelector('.b_error_msg--email-incorrect').classList.remove('hidden');
            console.log(err);
          },
        });
        e.preventDefault();
      });
    });

    getRegistrationForm.addEventListener('submit', function (event) {

      sendRequest({
        method: 'POST',
        url: baseUrl + '/api/auth/register',
        body: {
          name: event.target.name.value,
          email: event.target.email.value,
        },
        complete: function (res) {
          openModalWindow(succesRegistrationTemplate, bodyElem);
          event.target.name.value = '';
          event.target.email.value = '';
        },
        error: function (err) {
          registerErr.classList.remove('hidden');
          if (err.statusText === 'Conflict') {
            console.log('Conflict');
          }
        },
      });

      event.preventDefault();
    });

    getRegistrationForm.addEventListener('blur', function () {
      registerErr.classList.add('hidden');
    }, true);

    getLoginForm.addEventListener('submit', function (event) {
      console.log('request sent');
      console.log(event);
      sendRequest({
        method: 'POST',
        url: baseUrl + '/api/auth/desktopLogin',
        body: {
          password: event.target.loginPass.value,
          login: event.target.login.value,
        },
        complete: function (res) {
          console.log('login success' + res);
          var response = JSON.parse(res);

          setLocalStorageData('MEDtoken', response.token);
          setLocalStorageData('MEDuser', JSON.stringify(response.user));
          window.location.href = '/admin/';
        },
        error: function (err) {
          console.log(err.responseText);
          loginErr.classList.remove('hidden');
        },
      });

      event.preventDefault();
    });

    getLoginForm.addEventListener('blur', function () {
      loginErr.classList.add('hidden');
    }, true);

    function openModalWindow(template, body) {
      var modalDiv = document.createElement('div');
      modalDiv.classList.add('b_open-modal-window');
      modalDiv.innerHTML = template;
      body.insertBefore(modalDiv, body.firstChild);
      tabControl();
      modalDiv.querySelector('.b_close-recovery-password').addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
          closeModalWindow();
        }
      });
    }

    function closeModalWindow() {
      var openModalWindow = document.querySelector('.b_open-modal-window');
      document.body.removeChild(openModalWindow);
    }

    window.closePopup = closeModalWindow;

    //tabindex
    function tabControl() {
      var tabArray = document.querySelector('.b_open-modal-window').querySelectorAll('*[tabindex]');
      tabArray[0].focus();
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 9) {
          var keyShift = e.shiftKey;
          var currentElem = document.activeElement.getAttribute('tabindex');
          if (!keyShift && tabArray.length.toString() === currentElem) {
            tabArray[0].focus();
            e.preventDefault();
          } else if (keyShift && currentElem === '1') {
            e.preventDefault();
            tabArray[tabArray.length - 1].focus();
          }
        }
      });
    }
  });
}());

