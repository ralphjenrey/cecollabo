export const initialState = {};

export const loadingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, [action.payload.id]: true };
        case 'UNSET_LOADING':
            return { ...state, [action.payload.id]: false };
        default:
            return state;
    }
};