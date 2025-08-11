import { useEffect, useState } from "react";
import type { Actor } from "../types/Movie";
import { useMovieContext } from "../contexts/MovieContext";
import { searchActorsByQuery } from "../api/tmdb";

export default function SearchByActors() {
    const { language } = useMovieContext()!;
    const [query, setQuery] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Actor[]>([]);
    const [actors, setActors] = useState<Actor[]>([]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchSearchResults = async () => {
                const results = await searchActorsByQuery(query, language);
                setSearchResults(results);
                setIsDropdownVisible(true);
            };

            if (query.length > 1) {
                fetchSearchResults();
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, language]);

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
            {isDropdownVisible && searchResults.length > 0 && (
                <ul className="actors-drop-down">
                    {searchResults.map((result) => (
                        <li
                            key={result.id}
                            onClick={() => {
                                setActors(prev => [...prev, result]);
                                setQuery('');
                                setSearchResults([]);
                                setIsDropdownVisible(false);
                            }}
                            className="search-dropdown-item"
                        >
                            {result.name}
                        </li>
                    ))}
                </ul>
            )}
            <div className="choosen-actors-container">
                <h3>Choosen actors:</h3>
                <ul>
                    {actors.map((actor) => (
                        <li>{actor.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}