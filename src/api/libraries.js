import fetch from './helper';

const apiUrl = '/api/libraries';
const inviteUsersUrl = '/api/contentActions/inviteUsers';

export function getLibrariesList() {
  return fetch(apiUrl);
}

export function createLibrary(name) {
  if (!name) {
    return Promise.reject('Name is required');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify({ name }),
  });
}

export function deleteLibraries(body) {
  // body is an array of ids
  if (!body || !body instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'delete',
    body: JSON.stringify(body),
  });
}

export function getInvitedUsers(libraryIds) {
  if (!libraryIds) {
    return Promise.reject('Invalid libraryIds');
  }

  const path = (libraryIds instanceof Array) ? libraryIds.join(',') : libraryIds;

  return fetch(inviteUsersUrl + '/' + path);
}

export function inviteUsers(body) {
  if (!body || !body.libraries instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(inviteUsersUrl, {
    method: 'put',
    body: JSON.stringify(body),
  });
}

export function renameLibrary(body) {
  if (!body.id || !body.name || typeof body.name !== 'string') {
    return Promise.reject('Invalid data');
  }

  return fetch(apiUrl + '/changeLibraryName', {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function shareEmails(libraryId, emails) {
  if (!libraryId || !emails.length) {
    return Promise.reject('Invalid data share');
  }

  return fetch(apiUrl + '/shareLibrary', {
    method: 'post',
    body: JSON.stringify({
      emails,
      libraryId,
    }),
  });
}

export function rejectInvite(libraryId, companyId) {
  if (!libraryId || !companyId) {
    return Promise.reject('Invalid data for allow invite');
  }

  return fetch(apiUrl + `/rejectInvite?lib=${libraryId}&company=${companyId}`);
}
