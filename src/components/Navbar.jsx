import logoImg from "/src/assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import "/src/styles/Home.css";
import { logout } from "../users";
export default function Navbar({ homePage, FAQ, aboutUs }) {
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className="nav-left">
        <Link to={"/"} className="navbar-brand">
          <img src={logoImg} alt="UsedAnimals Logo" />
        </Link>
        <Link to={"/"} className="text-decoration-none brand-text">
          <p>USEDANIMALS.HU</p>
        </Link>
      </div>

      <div className="nav-center">
        <NavLink to={homePage} className="nav-link">
          Főoldal
        </NavLink>
        <NavLink to={FAQ} className="nav-link">
          GYÍK
        </NavLink>
        <NavLink to={aboutUs} className="nav-link">
          Rólunk
        </NavLink>
      </div>
      <div className="nav-item btn btn-danger">
        <FontAwesomeIcon icon={faArrowAltCircleRight} onClick={() => handleLogout()}/>
      </div>
    </>
  );
}
