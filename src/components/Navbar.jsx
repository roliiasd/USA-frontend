import logoImg from "/src/assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import "/src/styles/Home.css";
export default function Navbar({ homePage, FAQ, aboutUs }) {
  return (
    <>
        <div className="logoContainer">
          <Link to={"/"} className="navbar-brand">
            <img src={logoImg} alt="UsedAnimals Logo" />
          </Link>
          <Link to={"/"} className="text-decoration-none">
            <p>USEDANIMALS.HU</p>
          </Link>
        </div>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to={homePage} className="nav-link">
              Főoldal
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={FAQ} className="nav-link">
              GYÍK
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={aboutUs} className="nav-link">
              Rólunk
            </NavLink>
          </li>
          <li className="nav-item">
            <button className="btn btn-danger float-end" onClick={()=> logout()}>logout</button>
          </li>
        </ul>
    </>
  );
}
