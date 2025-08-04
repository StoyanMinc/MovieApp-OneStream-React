// MovieContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Movie } from '../types/Movie';
import { fetchGenres } from '../api/tmdb';

interface MovieContextType {
    movies: Movie[]; // replace with your movie type
    setMovies: React.Dispatch<React.SetStateAction<any[]>>;
    isMoviesSaved: boolean;
    setIsMoviesSaved: React.Dispatch<React.SetStateAction<boolean>>;
    genres: any[];
    setGenres: React.Dispatch<React.SetStateAction<any[]>>;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieContextProvider = ({ children }: { children: ReactNode }) => {
    const [movies, setMovies] = useState<any[]>([]);
    const [isMoviesSaved, setIsMoviesSaved] = useState<boolean>(false);
    const [genres, setGenres] = useState<any[]>([]);
    const [language, setLanguage] = useState('en-US');

    useEffect(() => {
        const getGenres = async () => {
            const response = await fetchGenres(language);
            setGenres(response.genres);
        }
        getGenres();
    }, [language]);

    return (
        <MovieContext.Provider value={{
            movies,
            setMovies,
            isMoviesSaved,
            setIsMoviesSaved,
            genres,
            setGenres,
            language,
            setLanguage
        }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => {
    const context = useContext(MovieContext);
    return context;
};
