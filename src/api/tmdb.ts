import axios from 'axios';
import type { Movie } from '../types/Movie';
import toast from 'react-hot-toast/headless';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchMoviesByTitles(titles: string[], language: string) {
    return Promise.all(
        titles.map(async (title) => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}&language=${language}`, {
                    // params: {
                    //     api_key: TMDB_API_KEY,
                    //     query: title,
                    //     language
                    // },
                });

                const movie = response.data.results?.[0];
                return movie || { title, notFound: true };
            } catch (error) {
                console.error(`Error fetching movie "${title}":`, error);
                return { title, error: true };
            }
        })
    );
}

export async function fetchGenres(language: string) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                api_key: TMDB_API_KEY,
                language
            },
        });

        const genres = response.data;
        return genres;
    } catch (error: any) {
        console.error('Error fetching genres:', error);
        return { error: error.data };
    }
}

export async function searchMoviesByQuery(query: string, language: string) {
    if (query.length < 2) return [];

    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_API_KEY,
                query,
                language
            },
        });

        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

export async function saveMovies(movies: Movie[]) {
    try {
        const response = await fetch('https://dummy-endpoint.com/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movies: movies }),
        });

        if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
        console.error('Save failed', error);
    }
}

export async function searchActorsByQuery(query: string, language: string) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/person', {
            params: {
                api_key: TMDB_API_KEY,
                query,
                language
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error searching actors:', error);
    }
}

export async function searchMoviesByActors(actorsIds: string, language: string) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: TMDB_API_KEY,
                with_cast: actorsIds,
                language
            },
        });
        return response.data.results;
    } catch (error) {
        toast.error('Error with fetching movie by actors!')
        console.error('Error searching actors:', error);
    }
}