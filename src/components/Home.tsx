import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useMovieContext } from "../contexts/MovieContext";
import { fetchMoviesByTitles } from '../api/tmdb';
import { getMovieGenres } from "../utils/getMovieGenre";
import ActionButton from "./ActionButton";
import { languages } from "../constants";

export default function Home() {
    const navigate = useNavigate();
    const { genres, setMovies, setIsMoviesSaved, language, setLanguage } = useMovieContext()!;
    const [movieTitles, setMovieTitles] = useState<string[]>([]);
    const [selectedMovies, setSelectedMovies] = useState<string[]>([]);


    const fileUploadHandler = (event: ChangeEvent<HTMLInputElement>): void => {

        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result as string;
            const movies = text
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean);
            setMovieTitles(movies);
            setSelectedMovies(movies);
            setIsMoviesSaved(false);
        };

        reader.readAsText(file);
        toast.success('Successfully upload your movie titles!')
    }

    const toggleMovie = (movie: string) => {
        setSelectedMovies((prevSelected) =>
            prevSelected.includes(movie)
                ? prevSelected.filter((m) => m !== movie)
                : [...prevSelected, movie]
        );
    };

    const searchMovies = async () => {
        try {
            const fetchedMovies = await fetchMoviesByTitles(selectedMovies, language);
            const moviesWithGenres = fetchedMovies.map(movie => ({
                ...movie,
                genres: getMovieGenres(genres, movie.genre_ids ?? []), // adds `genres` field
            }));
            setMovies(moviesWithGenres);
            navigate('/movie-list');
            toast.success('Successfully fetch movies from TMDB!');
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            toast.error('Something went wrong while fetching movies.');
        }
    };

    return (
        <div className="home-container">
            <div className="upload-box">
                <label htmlFor="file">Upload a .txt file with movie titles</label>
                <input type="file" id="file" name="file" onChange={fileUploadHandler} />
            </div>

            {movieTitles.length > 0 && (
                <>
                    <div className="language-selector-container">
                        <label htmlFor="language">Choose language:</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            {languages.map((l) => {
                                return <option value={l.value}>{l.text}</option>

                            })}
                        </select>
                    </div>
                    <div className="movie-list">
                        {movieTitles.map((movie, index) => (
                            <div key={index} className="movie-item">
                                <input
                                    type="checkbox"
                                    checked={selectedMovies.includes(movie)}
                                    onChange={() => toggleMovie(movie)}
                                />
                                <span>{movie}</span>
                            </div>
                        ))}

                    </div>
                    <ActionButton text="search" action={searchMovies} />
                </>
            )}
        </div>
    )
}
