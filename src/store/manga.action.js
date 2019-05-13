import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";

export const MANGAS_LOADED = 'MANGAS_LOADED';
export const LOAD_MANGAS = 'LOAD_MANGAS';
export const MANGA_MARKED_AS_FAVORITE = 'MANGA_MARKED_AS_FAVORITE';
export const MARK_MANGA_AS_FAVORITE = 'MARK_MANGA_AS_FAVORITE';

export const CHAPTERS_LOADED = 'CHAPTERS_LOADED';
export const LOAD_CHAPTERS = 'LOAD_CHAPTERS';
export const CHAPTERS_FILTER = 'CHAPTERS_FILTER';
export const RESET_FILTER = 'RESET_FILTER';

export const CHAPTER_LOADED = 'CHAPTER_LOADED';
export const LOAD_CHAPTER = 'LOAD_CHAPTER';

export const CHAPTER_MARKED_AS_READ = 'CHAPTER_MARKED_AS_READ';
export const MARK_CHAPTER_AS_READ = 'MARK_CHAPTER_AS_READ';



const getChapterNumber = (chapter) => {
  const indexOfUnderscore = chapter.indexOf('_');
  const number = chapter.substring(indexOfUnderscore+1, chapter.length)
  const lengthStr = number.length;
  if (number.substring(0, 3) === "000") {
    return number.substring(3, lengthStr);
  } else if (number.substring(0, 2) === "00") {
    return number.substring(2, lengthStr);
  } else if (number[0] === '0') {
    return number.substring(1, 4);
  } else {
    return number
  }
};

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
          .collection('mangasList').doc('mangas').get()
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
        data._data.list.map((item, index) => {
          promisesManga.push(
            isMangaFavorite(item.name)
              .then((isMangaFavorite) => { return {
                id: item.name, status: item.status, imgUrl: item.imgUrl,
                authors: item.authors, lastChapter: item.lastChapter,
                number: index, isMangaFavorite: isMangaFavorite
              }})
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
    dispatch({ type: RESET_FILTER });
    return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
      .then(() => {
        return firebase.firestore()
          .collection('mangasChapters').doc(manga).get();
      })
      .then((data) => {
        console.log(data);
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
        data._data.chaptersList.map((item) => {
          promisesChapter.push(
            isChapterRead(item)
              .then((isChapterRead) => { return {id: item, number: getChapterNumber(item), isChapterRead:isChapterRead }})
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

export function chapterLoaded(data) {
  return {
    type: CHAPTER_LOADED,
    chapter: data.chapter,
    error: data.error,
  };
};

export function loadChapter(userMail, userPassword, manga, chapterId) {
  return (dispatch) => {
    dispatch({ type: LOAD_CHAPTER });
    return firebase.auth().signInWithEmailAndPassword(userMail, userPassword)
      .then(() => {
        return firebase.firestore()
          .collection('mangasChapters').doc(manga)
          .collection('chapters').doc(chapterId).get();
      })
      .then((data) => {
        console.log(data);
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
        /*data._data.chaptersList.map((item) => {
          promisesChapter.push(
            isChapterRead(item)
              .then((isChapterRead) => { return {id: item, number: getChapterNumber(item), isChapterRead:isChapterRead }})
          );
        });*/
        return Promise.all(promisesChapter);
      })
      .then((data) => dispatch(chapterLoaded({ chapters: data.sort((a, b) => b.number - a.number) })))
      .catch((error) => dispatch(chapterLoaded({ error: error })));
  };
}


const markAsRead = async (id, value) => {
  try {
    await AsyncStorage.setItem(id, value);
  } catch (error) {
    console.log(error.message);
  }
};

export function chapterMarkedAsRead(data) {
  return {
    type: CHAPTER_MARKED_AS_READ,
    id: data.id,
    isRead: data.isRead
  };
}

export function markChapterAsRead(id, value) {
  return (dispatch) => {
    dispatch({ type: MARK_CHAPTER_AS_READ });
    return markAsRead(id, (value) ? '1' : '0')
      .then(() => dispatch(chapterMarkedAsRead({ id: id, isRead: value })));
  };
}
