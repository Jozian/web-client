export const listLayout = {
  type: WinJS.UI.ListLayout,
};

export const onEnterClick = fn => event => {
  if (event.target === event.currentTarget && (event.charCode === 13 || event.keyCode === 13)) {
    fn(event);
  }
};
