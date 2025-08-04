// useDebouncedMovieSearch.ts
import { useEffect, useState } from 'react';
import { searchMoviesByQuery } from '../api/tmdb';

export function useDebouncedMovieSearch(query: string, language: string) {
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchResults = async () => {
                if (query.length > 1) {
                    const results = await searchMoviesByQuery(query, language);
                    setSearchResults(results);
                    setIsDropdownVisible(true);
                }
            };
            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, language]);

    return { searchResults, isDropdownVisible, setIsDropdownVisible };
}
