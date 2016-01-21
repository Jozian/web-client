import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entity: {
    data: [],
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.FOLDER_LOADING:
    return { ...state, loading: true, error: null };
  case types.FOLDER_LOADED:
    const newEntity = {};
    newEntity.data = action.payload.data.map(item => {
      return {
        ...item,
        $id: item.type + item.id,
        timeStamp: new Date().getTime().toString(),
      };
    });
    newEntity.name = action.payload.name;
    newEntity.path = action.payload.path;
    return { ...state, loading: false, entity: newEntity, error: null };
  case types.FOLDER_LOAD_ERROR:
    return { ...state, loading: false, error: action.payload };
  case types.PREV_IMAGE_UPLOADED:
    const newEntityAfterImageUpdate = {};
    const indexItem = state.entity.data.findIndex((item) => `//preview/${item.id}.png` === action.payload);
    const changeItem = {...state.entity.data[indexItem], timeStamp: new Date().getTime().toString()};

    newEntityAfterImageUpdate.data = [...state.entity.data.slice(0, indexItem),
      changeItem,
      ...state.entity.data.slice(indexItem + 1)];
    newEntityAfterImageUpdate.name = state.entity.name;
    newEntityAfterImageUpdate.path = [...state.entity.path];
    return { ...state, loading: false, entity: newEntityAfterImageUpdate, error: null };
  default:
    return state;
  }
}
