(function() {
  window.onload = function() {
    var allIdElem = [];
    allIdElem.push(document.getElementById('getStarted'));
    allIdElem.push(document.getElementById('useCases'));
    allIdElem.push(document.getElementById('openSource'));
    allIdElem.push(document.getElementById('support'));
    allIdElem.push(document.getElementById('loginRegister'));
    var baseUrl = 'http://medserver.apps.wookieelabs.com';

    var forgotPasswordTemplate = '<div class="b_overlay-forgot-password b_overlay"> ' +
      '<div id="forgot-password-modal" class="b_forgot-password"> ' +
      '<div class="b_forgot-password-body"> ' +
      '<h3 class="b-forgot-password-body-title">Password Recovery</h3> ' +
      '<p class="b-forgot-password-body-text">' +
      'In order to reset your password, enter your email. If you have not received an email please check your Spam folder. ' +
      '</p> ' +
      '<form id="password-recovery-form" class="side-form" name="passwordRecovery" method="post" > ' +
      '<div class="control"> ' +
        '<div class="b_label-for-input">Email</div>' +
      '<input type="email" name="email" placeholder="Email" required autocomplete="on"/> ' +
      '</div> ' +
      '<div class="control"> ' +
      '<input type="submit" value="Send" class="b_reg-btn"> ' +
      '</div> ' +
      '<div class="control"> ' +
      '<div onClick="closePopup()" class="b_reg-btn b_close-recovery-password">CANCEL</div>' +
      '</div> ' +
      '</form> ' +
      '</div> ' +
      '</div> ' +
      '</div>';

    var resetPasswordTemplate = '<div class="b_overlay-reset-password b_overlay">' +
    '<div id="reset-password-modal" class="b_forgot-password">' +

    ' <div class="b_forgot-password-body">' +
    '<h3 class="b-forgot-password-body-title">Password Recovery</h3>' +

    '<form id="reset-password-form" class="side-form" name="passwordRecovery" method="post" >' +

    '<div class="control">' +
      '<div class="b_label-for-input">Password</div>' +
    '<input type="password" name="password" required autocomplete="on"/>' +
    '</div>' +

    '<div class="control">' +
      '<div class="b_label-for-input">Confirm Password</div>' +
    '<input type="password" name="confirmPassword" required autocomplete="on"/>' +
    '</div>' +

    '<div class="b_error_msg hidden" id="confirm_err" style="right: 31px !important; margin: 0">' +
    '<span>Passwords does not match</span>' +
    '</div>' +

    '<div class="b_error_msg hidden" id="expired-pass_err" style="right: 31px !important; margin: 0">' +
    '<span>Link was expired.</span>' +
    '</div>' +

    '<div class="control">' +
    '<input type="submit" value="Save" class="b_reg-btn">' +
    '</div>' +

      '<div class="control"> ' +
      '<div onClick="closePopup()" class="b_reg-btn b_close-recovery-password">CANCEL</div>' +
      '</div> ' +
    '</form>' +
    '</div>' +
    '</div>' +
    '</div>';

    var succesRegistrationTemplate = '<div class="b_overlay b_overlay_register-popup">' +
      '<div id="modal-window" class="b_register-popup">' +
        '<div class="b_register-popup-text">' +
          'Your account has been successfully created. An email has been sent to you with your credentials.' +
          'If you have not received an email please check your Spam folder.' +
        '</div>' +

        '<div class="b-register-popup-button-ok">OK</div>' +
      '</div>' +
    '</div>';

    var bodyElem = document.body;

    var allElemMenu = document.querySelectorAll('.b_start-header-menu > li > a');

    var getLoginForm = document.getElementById('login-form');
    var getRegistrationForm = document.getElementById('register-form');

    var forgotPassword = document.getElementById('forgot-pass');

    var loginErr = document.getElementById('login_err');
    var registerErr = document.getElementById('reg_err');

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

    if (window.location.hash.indexOf('#token') !== -1) {
      openModalWindow(resetPasswordTemplate, bodyElem);

      var resetPasswordForm = document.getElementById('reset-password-form');

      resetPasswordForm.addEventListener('submit', function(event) {
        var confirmErr = document.getElementById('confirm_err');
        var expiredErr = document.getElementById('expired-pass_err');
        if (event.target.password.value === event.target.confirmPassword.value) {
          confirmErr.classList.add('hidden');
          expiredErr.classList.add('hidden');
          sendRequest({
            method: 'POST',
            url: baseUrl + '/api/auth/passwordRecovery/',
            body: {
              newPass: event.target.password.value,
              token: window.location.hash.substr(1),
            },
            complete: function(res) {
              closeModalWindow();
              window.location.hash = '#loginRegister';
            },
            error: function(err) {
              expiredErr.classList.remove('hidden');
              console.log(err.statusText);
            },
          });
        } else {
          confirmErr.classList.remove('hidden');
        }

        event.preventDefault();
      });
    } else {
      window.location.hash = '#getStarted';
      selectBlock('getStarted', 0);
    }

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
      case 'loginRegister':
        selectBlock('loginRegister', 4);
        break;
      default:
        break;
      }
    });

    forgotPassword.addEventListener('click', function(e) {
      openModalWindow(forgotPasswordTemplate, bodyElem);
      var forgotPasswordRecovery = document.getElementById('password-recovery-form');
      forgotPasswordRecovery.addEventListener('submit', function(e) {
        sendRequest({
          method: 'PUT',
          url: baseUrl + '/api/auth/passwordRecovery/' + e.target.email.value,

          complete: function (request) {
            closeModalWindow();
            window.location.hash = '#getStarted';
          },
          error: function (err) {
            console.log(err);
          },
        });
        e.preventDefault();
      });
    });

    getRegistrationForm.addEventListener('submit', function(event) {

      sendRequest({
        method: 'POST',
        url: baseUrl + '/api/auth/register',
        body: {
          name: event.target.name.value,
          email: event.target.email.value,
        },
        complete: function (res) {
          openModalWindow(succesRegistrationTemplate, bodyElem);
          var buttonOkModal = document.querySelector('.b-register-popup-button-ok');
          buttonOkModal.addEventListener('click', function(e) {
            closeModalWindow();
            window.location.hash = '#getStarted';
          });
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

    getRegistrationForm.addEventListener('blur', function() {
      registerErr.classList.add('hidden');
    }, true);

    getLoginForm.addEventListener('submit', function(event) {

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
          window.location = '/';
        },
        error: function(err) {
          console.log(err.responseText);
          loginErr.classList.remove('hidden');
        },
      });

      event.preventDefault();
    });

    getLoginForm.addEventListener('blur', function() {
      loginErr.classList.add('hidden');
    }, true);
  };


  function openModalWindow(template, body) {
    var modalDiv = document.createElement('div');
    modalDiv.classList.add('b_open-modal-window');
    modalDiv.innerHTML = template;
    body.insertBefore(modalDiv, body.firstChild);
  }

  function closeModalWindow() {
    var openModalWindow = document.querySelector('.b_open-modal-window');
    document.body.removeChild(openModalWindow);
  }

  window.closePopup = function() {
    closeModalWindow();
  };
})();
