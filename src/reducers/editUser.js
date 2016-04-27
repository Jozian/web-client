import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entity: {
    data: new WinJS.Binding.List([]),
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.USER_EDITING:
  case types.USER_CREATING:
    return { ...state, loading: true, error: null };
  case types.USER_EDITED:
  case types.USER_CREATED:
    return {... state, loading: false, error: null};
  case types.USER_EDIT_ERROR:
  case types.USER_CREATE_ERROR:
    return { ...state, loading: false, error: action.errorMsg };
  case types.NEW_USER_LOAD:
    return { ...state, loading: false, entity: {}, isNew: true, error: null };
  default:
    return state;
  }
}
