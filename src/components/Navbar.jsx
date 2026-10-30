import { Link } from "react-router-dom";
import logo from "../assets/github-mark-white.svg";
import "./navbar.css";

export default function Navbar() {
  const userId = localStorage.getItem("userId");

  return (
    <nav>
      <Link to="/">
        <div>
          <img src={logo} alt="Github Logo" />
          <h3>Github</h3>
        </div>
      </Link>

      <div>
        <Link to="/create">
          <p>Create a Repository</p>
        </Link>

        <Link to={`/profile/${userId}`}>
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
}