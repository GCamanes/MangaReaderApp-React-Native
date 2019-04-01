import firebase from "react-native-firebase";

export const MANGAS_LOADED = 'MANGAS_LOADED';
export const LOAD_MANGAS = 'LOAD_MANGAS';


export function mangasLoaded(data) {
    return {
        type: MANGAS_LOADED,
        mangas: data.mangas,
        error: data.error,
    };
}

export function loadMangas(userMail, userPassword) {
    return (dispatch) => {
        dispatch({ type: LOAD_MANGAS });
        return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
            .then(() => {
                return firebase.firestore().collection('mangas').get()
            })
            .then((data) => {
                return data._docs.map((item) => (item.id))
            })
            .then((data) => dispatch(mangasLoaded({ mangas: data })))
            .catch((error) => dispatch(mangasLoaded({ error: error })));
    };
}