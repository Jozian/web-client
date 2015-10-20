import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entity: {
    data: new WinJS.Binding.List([]),
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.SEARCH_RESULT_LOADING:
    return { ...state, loading: true, error: null };
  case types.SEARCH_RESULT_LOADED:
    const newEntity = {...action.payload};
    newEntity.data = new WinJS.Binding.List(action.payload).createGrouped(
      function(dataItem) {
        return dataItem.type;
      },
      function(dataItem) {
        return { type: dataItem.type};
      },
      function(group1, group2) {
        if (group1 === 'user') {
          return -1;
        } else {
          return 1;
        }
      }
    );

   // newEntity.media.data = new WinJS.Binding.List(action.payload.media);
    return { ...state, loading: false, entity: newEntity, error: null };
  case types.SEARCH_RESULT_ERROR:
    return { ...state, loading: false, error: action.payload };
  default:
    return state;
  }
}
