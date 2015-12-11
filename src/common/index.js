export const listLayout = {
  type: WinJS.UI.ListLayout,
};

export const onEnterPressed = fn => event => {
  if (event.target === event.currentTarget && (event.charCode === 13 || event.keyCode === 13)) {
    fn(event);
  }
};

function returnPart(number, string, newString) {
  const currentNumber = number * 40;
  newString = newString + string.slice(currentNumber, currentNumber + 40) + ' \n ';

  if (string.length > currentNumber + 40) {
    return returnPart(number + 1, string, newString);
  }else if(string.length < currentNumber + 40 && string.length > currentNumber) {
    return newString + string.slice(currentNumber);
  } else {
    return newString;
  }
}

export function wrapLongString(string) {
  if (string.length > 40) {
    return returnPart(0, string, '');
  } else {
    return string;
  }
}

