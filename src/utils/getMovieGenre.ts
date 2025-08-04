
export const getMovieGenres = (
    genres: { id: number; name: string }[],
    genreIds: number[])
    : string[] => {

    return genreIds.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : null;
    }).filter(Boolean) as string[];
};
