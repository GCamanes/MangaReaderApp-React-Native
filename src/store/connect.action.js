import firebase from 'react-native-firebase';
import {AsyncStorage} from 'react-native';

export const UPDATE_CONNECTIVITY = 'UPDATE_CONNECTIVITY';
export const USER_LOGGEDIN = 'USER_LOGGEDIN';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export function updateConnectivity(connectivity) {
    return {
        type: UPDATE_CONNECTIVITY,
        connectivity,
    };
}

export function userLoggedIn(data) {
    return {
        type: USER_LOGGEDIN,
        userMail: data.userMail,
        userPassword: data.userPassword,
        userRemember: data.userRemember,
        error: data.error,
    };
}

export function loginUser(userMail, userPassword, userRemember) {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
            .then(() => dispatch(userLoggedIn({ userMail: userMail, userPassword: userPassword, userRemember: userRemember })))
            .catch((error) => dispatch(userLoggedIn({ error: "Wrong mail or password" })))
    };
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
    };
}