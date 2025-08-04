import { useNavigate, useParams } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import { formatReleaseDate } from "../utils/formatDate";

export default function MovieDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { movies } = useMovieContext()!;
    const movie = movies.find((m) => m.id === Number(id));

    if (!movie) return <p>Movie not found</p>;
    console.log(movie);
    return (
        <div className="movie-details-page">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <div className="movie-details-card">
                <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-details-image"
                />
                <div className="movie-details-info">
                    <h2>{movie.title}</h2>
                    <p><strong>Original Title:</strong> {movie.original_title}</p>
                    <p><strong>Release Date:</strong> {formatReleaseDate(movie.release_date)}</p>
                    <p><strong>genre:</strong> {movie.genres?.join(', ')}</p>
                    <p><strong>Language:</strong> {movie.original_language}</p>
                    <p><strong>Overview:</strong> {movie.overview}</p>
                    <p><strong>Popularity:</strong> {movie.popularity}</p>
                    <p><strong>Vote Average:</strong> {movie.vote_average}</p>
                </div>
            </div>
        </div>
    );
}