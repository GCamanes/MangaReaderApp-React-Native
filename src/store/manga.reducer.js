import {
    LOAD_MANGAS, MANGAS_LOADED,
    LOAD_CHAPTERS, CHAPTERS_LOADED,
    LOAD_PAGES, PAGES_LOADED,
} from './manga.action';

export const initialState = {
    mangas: [],
    mangasError: undefined,
    mangasLoading: false,

    chapters: [],
    chaptersError: undefined,
    chaptersLoading: false,

    pages: [],
    pagesError: undefined,
    pagesLoading: false,
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
        case PAGES_LOADED: {
            return {
                ...state,
                pages: (action.pages) ? action.pages : [],
                pagesError: action.error,
                pagesLoading: false,
            };
        }
        case LOAD_PAGES: {
            return {
                ...state,
                pagesLoading: true,
            };
        }
        default:
            return state;
    }
}