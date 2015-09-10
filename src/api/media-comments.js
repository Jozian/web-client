import fetch from './helper';

const apiUrl = '/api/comments/';

export function getList(id) {
  return fetch(apiUrl + id).then( (data) => {
    const arraySort = [];
    data.forEach( (itemParent) => {
      if (!itemParent.parentId) {
        arraySort.push(itemParent);
        data.forEach( (itemChild) => {
          if (itemParent.id === itemChild.parentId) {
            arraySort.push(itemChild);
          }
        });
      }
    });
    return arraySort;
  });
}

export function deleteComments(body) {
  if (!body || !body instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'delete',
    body: JSON.stringify(body),
  });
}

export function createComment(data) {
  let method;
  let currentUrl = apiUrl;
  const dataObject = {
    id: data.id,
    text: data.text,
    author: data.author,
  };

  if (data.parentId) {
    dataObject.parentId = data.parentId;
  }

  if (!data.text && !data.author) {
    return Promise.reject('Invalid text comment or user id');
  }

  if (data.replay === 'Edit') {
    method = 'PUT';
  } else {
    method = 'POST';
  }

  if (method === 'PUT') {
    currentUrl += data.id;
  }

  return fetch(currentUrl, {
    method: method,
    body: JSON.stringify(dataObject),
  });
}
