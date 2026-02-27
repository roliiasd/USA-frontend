import logoImg from "/src/assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "/src/styles/Home.css";
import { useState } from "react";
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
          <button
            className="btn btn-danger float-end"
            onClick={() => handleLogout()}
          >
            logout
          </button>
        </li>
      </ul>
    </>
  );
}
