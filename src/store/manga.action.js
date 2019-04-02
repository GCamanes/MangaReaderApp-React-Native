import firebase from "react-native-firebase";

export const MANGAS_LOADED = 'MANGAS_LOADED';
export const LOAD_MANGAS = 'LOAD_MANGAS';

export const CHAPTERS_LOADED = 'CHAPTERS_LOADED';
export const LOAD_CHAPTERS = 'LOAD_CHAPTERS';

export const PAGES_LOADED = 'PAGES_LOADED';
export const LOAD_PAGES = 'LOAD_PAGES';

export const CHAPTERS_FILTER = 'CHAPTERS_FILTER';


export function mangasLoaded(data) {
    return {
        type: MANGAS_LOADED,
        mangas: data.mangas,
        error: data.error,
    };
}

export function loadMangas(userMail, userPassword) {
    return (dispatch) => {
        dispatch({type: LOAD_MANGAS});
        return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
            .then(() => {
                return firebase.firestore()
                    .collection('mangas').get()
            })
            .then((data) => {
                return data._docs.map((item) => (item.id))
            })
            .then((data) => dispatch(mangasLoaded({mangas: data})))
            .catch((error) => dispatch(mangasLoaded({error: error})));
    };
}

export function chaptersLoaded(data) {
    return {
        type: CHAPTERS_LOADED,
        chapters: data.chapters,
        error: data.error,
    };
}

export function loadChapters(userMail, userPassword, manga) {
    return (dispatch) => {
        dispatch({type: LOAD_CHAPTERS});
        return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
            .then(() => {
                return firebase.firestore()
                    .collection('mangas').doc(manga)
                    .collection('chapters').get();
            })
            .then((data) => {
                return data._docs.map((item, index) => {
                    return ({id: item.id, number: index + 1})
                })
            })
            .then((data) => dispatch(chaptersLoaded({chapters: data.sort((a, b) => b.number - a.number)})))
            .catch((error) => dispatch(chaptersLoaded({error: error})));
    };
}

export function pagesLoaded(data) {
    return {
        type: PAGES_LOADED,
        pages: data.pages,
        error: data.error,
    };
}

export function loadPages(userMail, userPassword, manga, chapter) {
    return (dispatch) => {
        dispatch({type: LOAD_PAGES});
        return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
            .then(() => {
                return firebase.firestore()
                    .collection('mangas').doc(manga)
                    .collection('chapters').doc(chapter)
                    .collection('pages').get();
            })
            .then((data) => {
                return data._docs.map((item, index) => {
                    return (
                        {id: item.id, page: index, url: item._data.url}
                    )
                })
            })
            .then((data) => dispatch(pagesLoaded({pages: data})))
            .catch((error) => dispatch(pagesLoaded({error: error})));
    };
}

export function filterChapterList() {
    return {
        type: CHAPTERS_FILTER,
    }
}