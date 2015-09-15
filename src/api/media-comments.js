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

export function createComment(commentData) {
  if (!commentData.text && !commentData.author) {
    return Promise.reject('Invalid text comment or user id');
  }

  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export function updateComment(commentData) {
  if (!commentData.text && !commentData.author) {
    return Promise.reject('Invalid text comment or user id');
  }

  return fetch(apiUrl + commentData.id, {
    method: 'PUT',
    body: JSON.stringify(commentData),
  });
}
