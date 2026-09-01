import { Link } from "react-router-dom";
import "../styles/NotFound.css"; 

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="animated-404">404</h1>
      <p className="not-found-text">Oops! The page you are looking for has vanished into the void.</p>
      <Link to="/" className="back-home-btn">
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;