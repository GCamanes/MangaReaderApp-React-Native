import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";

export const MANGAS_LOADED = 'MANGAS_LOADED';
export const LOAD_MANGAS = 'LOAD_MANGAS';

export const CHAPTERS_LOADED = 'CHAPTERS_LOADED';
export const LOAD_CHAPTERS = 'LOAD_CHAPTERS';

export const PAGES_LOADED = 'PAGES_LOADED';
export const LOAD_PAGES = 'LOAD_PAGES';

export const CHAPTERS_FILTER = 'CHAPTERS_FILTER';

export const CHAPTER_MARKED_AS_READ = 'CHAPTER_MARKED_AS_READ';
export const MARK_CHAPTER_AS_READ = 'MARK_CHAPTER_AS_READ';

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
        return firebase.firestore()
          .collection('mangas').get()
      })
      .then((data) => {
        return data._docs.map((item) => (item.id))
      })
      .then((data) => dispatch(mangasLoaded({ mangas: data })))
      .catch((error) => dispatch(mangasLoaded({ error: error })));
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
    dispatch({ type: LOAD_CHAPTERS });
    return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
      .then(() => {
        return firebase.firestore()
          .collection('mangas').doc(manga)
          .collection('chapters').get();
      })
      .then((data) => {
        const isChapterRead = async (chapter) => {
          let isChapterRead = '0';
          try {
            isChapterRead = await AsyncStorage.getItem(chapter) || '0';
          } catch (error) {
            console.log(error.message);
          }
          return isChapterRead;
        }
        var promisesChapter = [];
        data._docs.map((item, index) => {
          promisesChapter.push(
            isChapterRead(item.id)
              .then((isChapterRead) => { return {id: item.id, number: index + 1, isChapterRead:isChapterRead }})
          );
        })
        return Promise.all(promisesChapter);
      })
      .then((data) => dispatch(chaptersLoaded({ chapters: data.sort((a, b) => b.number - a.number) })))
      .catch((error) => dispatch(chaptersLoaded({ error: error })));
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
    dispatch({ type: LOAD_PAGES });
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
            { id: item.id, page: index, url: item._data.url }
          )
        })
      })
      .then((data) => dispatch(pagesLoaded({ pages: data })))
      .catch((error) => dispatch(pagesLoaded({ error: error })));
  };
}

export function filterChapterList() {
  return {
    type: CHAPTERS_FILTER,
  }
}

export function chapterMarkedAsRead(data) {
  return {
    type: CHAPTER_MARKED_AS_READ,
    chapter: data.chapter
  };
}

export function markChapterAsRead(chapter, overwrite) {
  return (dispatch) => {
    dispatch({ type: MARK_CHAPTER_AS_READ });
    const isChapterRead = async (chapter) => {
      let isChapterRead = '0';
      try {
        isChapterRead = await AsyncStorage.getItem(chapter) || '0';
      } catch (error) {
        console.log(error.message);
      }
      return isChapterRead;
    }
    const markAsRead = async (chapter, isChapterRead, overwrite) => {
      try {
        if (overwrite) {
          await AsyncStorage.setItem(chapter, (isChapterRead === '1') ? '0' : '1');
        } else {
          await AsyncStorage.setItem(chapter, '1');
        }
      } catch (error) {
        console.log(error.message);
      }
      return chapter;
    };
    return isChapterRead(chapter)
      .then((isChapterRead) => markAsRead(chapter, isChapterRead, overwrite))
      .then(() => dispatch(chapterMarkedAsRead({ chapter: chapter })));
  };
}