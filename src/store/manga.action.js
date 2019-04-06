import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";

export const MANGAS_LOADED = 'MANGAS_LOADED';
export const LOAD_MANGAS = 'LOAD_MANGAS';
export const MANGA_MARKED_AS_FAVORITE = 'MANGA_MARKED_AS_FAVORITE';
export const MARK_MANGA_AS_FAVORITE = 'MARK_MANGA_AS_FAVORITE';

export const CHAPTERS_LOADED = 'CHAPTERS_LOADED';
export const LOAD_CHAPTERS = 'LOAD_CHAPTERS';
export const CHAPTERS_FILTER = 'CHAPTERS_FILTER';
export const CHAPTER_MARKED_AS_READ = 'CHAPTER_MARKED_AS_READ';
export const MARK_CHAPTER_AS_READ = 'MARK_CHAPTER_AS_READ';

export const PAGES_LOADED = 'PAGES_LOADED';
export const LOAD_PAGES = 'LOAD_PAGES';

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
        const isMangaFavorite = async (manga) => {
          let isMangaFavorite = 'off';
          try {
            isMangaFavorite = await AsyncStorage.getItem(manga) || 'off';
          } catch (error) {
            console.log(error.message);
          }
          return (isMangaFavorite === 'on');
        };
        var promisesManga = [];
        data._docs.map((item, index) => {
          promisesManga.push(
            isMangaFavorite(item.id)
              .then((isMangaFavorite) => { return { id: item.id, number: index, isMangaFavorite: isMangaFavorite }})
          );
        });
        return Promise.all(promisesManga);
      })
      .then((data) => dispatch(mangasLoaded({ mangas: data })))
      .catch((error) => dispatch(mangasLoaded({ error: error })));
  };
}

const markAsFavorite = async (manga, value) => {
  try {
    await AsyncStorage.setItem(manga, value);
  } catch (error) {
    console.log(error.message);
  }
};

export function mangaMarkedAsFavorite(data) {
  return {
    type: MANGA_MARKED_AS_FAVORITE,
    manga: data.manga,
    isFavorite: data.isFavorite
  };
}

export function markMangaAsFavorite(manga, value) {
  return (dispatch) => {
    dispatch({ type: MARK_MANGA_AS_FAVORITE });
    return markAsFavorite(manga, (value) ? 'on' : 'off')
      .then(() => dispatch(mangaMarkedAsFavorite({ manga: manga, isFavorite: value })));
  };
}

const getChapterNumber = (chapter) => {
  const number4digits = chapter.split("chap")[1];

  if (number4digits.substring(0, 3) === "000") {
    return number4digits[3];
  } else if (number4digits.substring(0, 2) === "00") {
    return number4digits.substring(2, 4);
  } else if (number4digits[0] === '0') {
    return number4digits.substring(1, 4);
  } else {
    return number4digits
  }
};

export function chaptersLoaded(data) {
  return {
    type: CHAPTERS_LOADED,
    chapters: data.chapters,
    error: data.error,
  };
};

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
          return (isChapterRead === '1');
        };
        var promisesChapter = [];
        data._docs.map((item) => {
          promisesChapter.push(
            isChapterRead(item.id)
              .then((isChapterRead) => { return {id: item.id, number: getChapterNumber(item.id), isChapterRead:isChapterRead }})
          );
        });
        return Promise.all(promisesChapter);
      })
      .then((data) => dispatch(chaptersLoaded({ chapters: data.sort((a, b) => b.number - a.number) })))
      .catch((error) => dispatch(chaptersLoaded({ error: error })));
  };
}

export function filterChapterList() {
  return {
    type: CHAPTERS_FILTER,
  }
}

const markAsRead = async (chapter, value) => {
  try {
    await AsyncStorage.setItem(chapter, value);
  } catch (error) {
    console.log(error.message);
  }
};

export function chapterMarkedAsRead(data) {
  return {
    type: CHAPTER_MARKED_AS_READ,
    chapter: data.chapter,
    isRead: data.isRead
  };
}

export function markChapterAsRead(chapter, value) {
  return (dispatch) => {
    dispatch({ type: MARK_CHAPTER_AS_READ });
    return markAsRead(chapter, (value) ? '1' : '0')
      .then(() => dispatch(chapterMarkedAsRead({ chapter: chapter, isRead: value })));
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