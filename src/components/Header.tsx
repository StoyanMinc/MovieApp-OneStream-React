import { useNavigate } from "react-router-dom";
import logoIcon from '../assets/images/movie.jpg'

export default function Header() {
    const navigate = useNavigate();

    const goToHome = () => navigate('/');

    return (
        <div className="header-container">
            <div onClick={goToHome}>
                <img
                    src={logoIcon}
                    className="logo"
                />
            </div>
            <div className="title-container">
                <h1>Welcome to Movie land ;)</h1>
                <h3>Search you favorite movies, save it and more...</h3>
            </div>
         
        </div>
    );
}