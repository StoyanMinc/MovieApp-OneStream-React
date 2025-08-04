import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { Movie } from '../types/Movie';
import { fetchGenres, fetchMoviesByTitles, saveMovies, searchMoviesByQuery } from '../api/tmdb';
import { useMovieContext } from '../contexts/MovieContext';
import ConfirmModal from './ConfirmModal';
import ActionButton from './ActionButton';
import toast from 'react-hot-toast';
import { languages } from '../constants';
import { getMovieGenres } from '../utils/getMovieGenre';
import { moveItem } from '../utils/reorederMovies';
import MovieCard from './MovieCard';

export default function MovieList() {
    const { movies, setMovies, genres, setGenres, language, setLanguage, isMoviesSaved, setIsMoviesSaved } = useMovieContext()!;
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [selectedGenre, setSelectedGenre] = useState<number>(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [query, setQuery] = useState('');

    const filteredMovies = selectedGenre === 0
        ? movies
        : movies.filter((movie) => movie.genre_ids.includes(Number(selectedGenre)));

    const removeMovie = (id: number) => {
        setMovies(prev => prev.filter(movie => movie.id !== id));
        setShowConfirmModal(false);
        setSelectedMovie(null);
    };

    const handleSave = async () => {
        try {
            await saveMovies(movies);
            toast.success('Successfully stored movies in our database!');
            setIsMoviesSaved(true);
        } catch (error) {
            console.error('Save failed', error);
            toast.error('Error saving movies to your database!');
        }
    };

    async function handleLanguageChange(
        newLang: string,
        movies: Movie[],
        setLanguage: (lang: string) => void,
        setMovies: (movies: Movie[]) => void,
        setGenres: (genres: any[]) => void
    ) {
        setLanguage(newLang);
        const titles = movies.map(m => m.title);
        const fetchedMovies = await fetchMoviesByTitles(titles, newLang);
        const { genres: fetchedGenres } = await fetchGenres(newLang);

        const moviesWithGenres = fetchedMovies.map(movie => ({
            ...movie,
            genres: getMovieGenres(fetchedGenres, movie.genre_ids || [])
        }));

        setGenres(fetchedGenres);
        setMovies(moviesWithGenres);
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchSearchResults = async () => {
                const results = await searchMoviesByQuery(query, language);
                setSearchResults(results);
                setIsDropdownVisible(true);
            };

            if (query.length > 1) {
                fetchSearchResults();
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, language]);

    if (movies.length === 0) {
        return (
            <div className='no-movies-container'>
                <h1>Not movies to show yet!</h1>
                <h3>Please go to <Link style={{ textDecoration: 'none', fontSize: '25px' }} to={'/'}>home page</Link> and upload a text file with your movie titles :)</h3>
            </div>
        )
    }
    return (
        <div>
            <div className='movies-options'>
                <div className='movies-filter'>
                    <label htmlFor="genres">Filter movies by genre</label>
                    <select name="genres" id="genres" onChange={(e) => setSelectedGenre(Number(e.target.value))}>
                        <option value='0'>all</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
                <div className="language-selector-container">
                    <label htmlFor="language">Change language:</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) =>
                            handleLanguageChange(
                                e.target.value,
                                movies,
                                setLanguage,
                                setMovies,
                                setGenres
                            )
                        }
                    >
                        {languages.map((l) => (
                            <option key={l.value} value={l.value}>
                                {l.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='search-movies'>
                    <label htmlFor="search">Search Movies by title</label>
                    <input
                        type="text"
                        name='search'
                        id='search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsDropdownVisible(true)}
                        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // timeout to allow click
                    />
                    {isDropdownVisible && searchResults.length > 0 && (
                        <ul className="search-dropdown">
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    onClick={() => {
                                        const genreNames = result.genre_ids?.map(id => {
                                            const match = genres.find(g => g.id === id);
                                            return match ? match.name : 'Unknown';
                                        }) || [];

                                        setMovies(prev => [...prev, { ...result, genres: genreNames }]);
                                        setQuery('');
                                        setSearchResults([]);
                                        setIsDropdownVisible(false);
                                    }}
                                    className="search-dropdown-item"
                                >
                                    {result.title} ({result.release_date?.slice(0, 4)})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {movies.length > 0 && !isMoviesSaved && (<ActionButton text="save" action={handleSave} />)}
            </div>

            {filteredMovies.length === 0 && (
                <div className='no-filtered-movies-container'>
                    <h1>Not movies to show in this genre!</h1>
                </div>
            )}

            <div className="movie-list-container">
                {showConfirmModal && selectedMovie && (
                    <ConfirmModal
                        text='Are you sure you want delete this movie?'
                        cancelHandler={() => setShowConfirmModal(false)}
                        actionHandler={() => removeMovie(selectedMovie.id)}
                    />
                )}
                {filteredMovies.length > 0 && filteredMovies.map((movie) => {
                    const index = movies.findIndex(m => m.id === movie.id);
                    return (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onDelete={(movie) => {
                                setSelectedMovie(movie);
                                setShowConfirmModal(true);
                            }}
                            onMoveUp={() => setMovies(moveItem(movies, index, index - 1))}
                            onMoveDown={() => setMovies(moveItem(movies, index, index + 1))}
                            canMoveUp={index > 0}
                            canMoveDown={index < movies.length - 1}
                        />
                    )
                })}
            </div>
        </div>
    );
}