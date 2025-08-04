import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useMovieContext } from "../contexts/MovieContext";
import type { Movie } from "../types/Movie";

export default function MovieEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { movies, setMovies } = useMovieContext()!;
    const movie = movies.find((m) => m.id === Number(id));
    const [formData, setFormData] = useState<Movie | null>(movie ?? null);

    if (!formData) return <p>Movie not found!</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMovies((prev) =>
            prev.map((m) => (m.id === formData.id ? formData : m))
        );
        navigate("/movie-list");
    };
    console.log(movie);

    return (
        <div className="edit-movie-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <div className="edit-movie-form-container">
                <h2>Edit Movie</h2>
                <form className="edit-movie-form" onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                    </label>
                    <label>
                        Overview:
                        <textarea name="overview" value={formData.overview} onChange={handleChange} />
                    </label>
                    <label>
                        Release Date:
                        <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
                    </label>
                    <button type="submit" className="save-button">Save Changes</button>
                </form>
            </div>
        </div>

    );
}