import {
    UPDATE_CONNECTIVITY,
    USER_LOGGEDIN, LOGIN_USER, LOGOUT_USER
} from './connect.action';

import {AsyncStorage} from 'react-native';

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
            if (action.userRemember && action.userMail && action.userPassword) {
                console.log("saving user infos");
                AsyncStorage.setItem('userMail', action.userMail);
                AsyncStorage.setItem('userPassword', action.userPassword);
            } else {
                console.log("deleting user infos");
                AsyncStorage.removeItem('userMail');
                AsyncStorage.removeItem('userPassword');
            }
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