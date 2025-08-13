import { useEffect, useState } from "react";
import type { Actor, Movie } from "../types/Movie";
import { useMovieContext } from "../contexts/MovieContext";
import { searchActorsByQuery, searchMoviesByActors } from "../api/tmdb";
import toast from "react-hot-toast";

export default function SearchByActors() {
    const { language, setMovies } = useMovieContext()!;
    const [query, setQuery] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [searchedActors, setSearchedActors] = useState<Actor[]>([]);
    const [choosenActors, setChoosenActors] = useState<Actor[]>([]);
    const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchSearchedActors = async () => {
                const results = await searchActorsByQuery(query, language);
                setSearchedActors(results);
                setIsDropdownVisible(true);
            };

            if (query.length > 1) {
                fetchSearchedActors();
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, language]);

    const searchMoviesByActorsHandler = async () => {
        const actorsIds = choosenActors.map((actor) => actor.id).join(',');
        const result = await searchMoviesByActors(actorsIds, language);
        setSearchedMovies(result);
        setQuery('');
        setChoosenActors([]);
        toast.success('Successfuly fetched movie by actors!');

    }
    const addMovieHandler = (movie: Movie) => {
        setMovies((prev) => [...prev, movie])
        setSearchedMovies((prev) => prev.filter((m) => m.id !== movie.id));
    };
    return (
        <div className="search-by-actors-container">
            <div className="search-by-actors-input-container">
                <label htmlFor="actor">choose actor:</label>
                <input
                    type="text"
                    name="actor"
                    id="actor"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {isDropdownVisible && searchedActors.length > 0 && (
                <ul className="actors-drop-down">
                    {searchedActors.map((result) => (
                        <li
                            key={result.id}
                            onClick={() => {
                                setChoosenActors(prev => [...prev, result]);
                                setQuery('');
                                setSearchedActors([]);
                                setIsDropdownVisible(false);
                            }}
                            className="search-dropdown-item"
                        >
                            {result.name}
                        </li>
                    ))}
                </ul>
            )}
            {choosenActors.length > 0 && (
                <div className="choosen-actors-container">
                    <h3>Choosen choosenActors:</h3>
                    <ul>
                        {choosenActors.map((actor) => (
                            <li key={actor.id}>{actor.name}</li>
                        ))}
                    </ul>
                    <button onClick={searchMoviesByActorsHandler}>Search for movies</button>
                </div>
            )}
            {searchedMovies.length > 0 && (
                <div className="searched-movies-container">
                    {searchedMovies.map((movie) => (
                        <div key={movie.id} className="searched-movie-container">
                            <div className="searched-movie-title-holder">
                                <p>{movie.title}</p>
                            </div>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <button onClick={() => addMovieHandler(movie)}>Add movie</button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}