import {
    UPDATE_CONNECTIVITY,
    USER_LOGGEDIN, LOGIN_USER, LOGOUT_USER
} from './connect.action';

export const initialState = {
    connectivity: 'offline',
    userMail: "",
    userPassword: "",
    loginError: undefined,
    loading: false,
};

export function connectReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CONNECTIVITY: {
            return {
                ...state,
                connectivity: action.connectivity,
            };
        }
        case USER_LOGGEDIN: {
            return {
                ...state,
                userMail: (action.userMail) ? action.userMail : "",
                userPassword: (action.userPassword) ? action.userPassword : "",
                loginError: action.error,
                loading: false,
            };
        }
        case LOGIN_USER: {
            return {
                ...state,
                loading: true,
            };
        }
        case LOGOUT_USER: {
            return {
                ...state,
                userMail: "",
                userPassword: "",
                loginError: undefined,
                loading: false,
            };
        }
        default:
            return state;
    }
}