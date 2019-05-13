import {
    LOAD_MANGAS, MANGAS_LOADED,
    LOAD_CHAPTERS, CHAPTERS_LOADED,
    CHAPTERS_FILTER, RESET_FILTER,
    MARK_CHAPTER_AS_READ, CHAPTER_MARKED_AS_READ,
    MARK_MANGA_AS_FAVORITE, MANGA_MARKED_AS_FAVORITE
} from './manga.action';

export const initialState = {
    mangas: [],
    mangasError: undefined,
    mangasLoading: false,
    mangasListNeedRefresh: false,
    mangaMarkingAsFavorite: false,

    chapters: [],
    chaptersError: undefined,
    chaptersLoading: false,
    chaptersListFilter: 'down',
    chaptersListNeedRefresh: false,
    chapterMarkingAsRead: false,
};

export function mangaReducer(state = initialState, action) {
    switch (action.type) {
        case MANGAS_LOADED: {
            return {
                ...state,
                mangas: (action.mangas) ? action.mangas : [],
                mangasError: action.error,
                mangasLoading: false,
            };
        }
        case LOAD_MANGAS: {
            return {
                ...state,
                mangasLoading: true,
            };
        }
        case MANGA_MARKED_AS_FAVORITE: {
            const manga = state.mangas.find((item) => item.id === action.manga);
            manga.isMangaFavorite = action.isFavorite;
            const others = state.mangas.filter((item) => item.id !== action.manga);
            return {
                ...state,
                mangas: [...others, manga].sort((a, b) => a.number - b.number),
                mangaMarkingAsFavorite: false,
                mangasListNeedRefresh: !state.mangasListNeedRefresh
            };
        }
        case MARK_MANGA_AS_FAVORITE: {
            return {
                ...state,
                mangaMarkingAsFavorite: true,
            };
        }
        case CHAPTERS_LOADED: {
            return {
                ...state,
                chapters: (action.chapters) ? action.chapters : [],
                chaptersError: action.error,
                chaptersLoading: false,
            };
        }
        case LOAD_CHAPTERS: {
            return {
                ...state,
                chaptersLoading: true,
            };
        }
        case CHAPTERS_FILTER: {
            return {
                ...state,
                chapters: (state.chaptersListFilter === 'down')
                  ? state.chapters.sort((a, b) => a.number - b.number)
                  : state.chapters.sort((a, b) => b.number - a.number),
                chaptersListFilter: (state.chaptersListFilter === 'down') ? 'up' : 'down',
                chaptersListNeedRefresh: !state.chaptersListNeedRefresh
            }
        }
        case RESET_FILTER: {
            return {
                ...state,
                chaptersListFilter: 'down',
            }
        }
        case CHAPTER_MARKED_AS_READ: {
            const chapter = state.chapters.find((item) => item.id === action.chapter);
            chapter.isChapterRead = action.isRead;
            const others = state.chapters.filter((item) => item.id !== action.chapter);
            return {
                ...state,
                chapters: (state.chaptersListFilter === 'down')
                  ? [...others, chapter].sort((a, b) => b.number - a.number)
                  : [...others, chapter].sort((a, b) => a.number - b.number),
                chapterMarkingAsRead: false,
                chaptersListNeedRefresh: !state.chaptersListNeedRefresh
            };
        }
        case MARK_CHAPTER_AS_READ: {
            return {
                ...state,
                chapterMarkingAsRead: true,
            };
        }
        default:
            return state;
    }
}