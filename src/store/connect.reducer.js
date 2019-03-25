import {
    UPDATE_CONNECTIVITY,
} from './connect.action';

export const initialState = {
    connectivity: 'offline',
};

export function connectReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CONNECTIVITY: {
            return {
                ...state,
                connectivity: action.connectivity,
            };
        }
        default:
            return state;
    }
}