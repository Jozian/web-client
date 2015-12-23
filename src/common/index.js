export const listLayout = {
  type: WinJS.UI.ListLayout,
};

export const onEnterPressed = fn => event => {
  if (event.target === event.currentTarget && (event.charCode === 13 || event.keyCode === 13)) {
    fn(event);
  }
};

export function isInputField(e) {
  if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA') {
    return false;
  } else {
    return true;
  }
}

