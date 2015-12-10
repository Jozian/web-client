import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entity: {
    data: [],
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.COMMENTS_LOADING:
    return { ...state, loading: true, error: null };
  case types.COMMENTS_LOADED:
    const arraySort = [];
    action.payload.data.forEach( (itemParent) => {
      if (!itemParent.parentId) {
        arraySort.push(itemParent);
        action.payload.data.forEach( (itemChild) => {
          if (itemParent.id === itemChild.parentId) {
            arraySort.push(itemChild);
          }
        });
      }
    });
    const newEntity = {...arraySort};
    newEntity.data = arraySort;
    return { ...state, loading: false, entity: newEntity, error: null };
  case types.COMMENTS_LOAD_ERROR:
    return { ...state, loading: false, error: action.payload };
  default:
    return state;
  }
}

