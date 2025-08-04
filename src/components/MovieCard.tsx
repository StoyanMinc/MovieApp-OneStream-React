// components/MovieCard.tsx
import { Link } from 'react-router-dom';
import { Edit, Info, Trash } from "lucide-react";
import { formatReleaseDate } from '../utils/formatDate';
import type { Movie } from '../types/Movie';

interface MovieCardProps {
    movie: Movie;
    index: number;
    onDelete: (movie: Movie) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

export default function MovieCard({
    movie,
    onDelete,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
}: MovieCardProps) {
    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <div className="movie-details">
                <div className='movie-text'>
                    <h3>{movie.title}</h3>
                    <p><span>year:</span> {formatReleaseDate(movie.release_date)}</p>
                    <p><span>genre:</span> {movie.genres?.join(', ')}</p>
                </div>
                <div className="buttons-container">
                    <Link to={`/movie-list/${movie.id}/details`} className="icon-button info">
                        <Info size={22} style={{ color: 'blue' }} />
                    </Link>
                    <Link to={`/movie-list/${movie.id}/edit`} className="icon-button edit">
                        <Edit size={22} style={{ color: 'green' }} />
                    </Link>
                    <span
                        className="icon-button delete"
                        onClick={() => onDelete(movie)}
                    >
                        <Trash size={22} style={{ color: 'red' }} />
                    </span>
                </div>
                <div className="reorder-buttons-container">
                    <button onClick={onMoveUp} disabled={!canMoveUp}>←</button>
                    <button onClick={onMoveDown} disabled={!canMoveDown}>→</button>
                </div>
            </div>
        </div>
    );
}
