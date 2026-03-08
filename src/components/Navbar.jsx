import { useState } from "react";
import logoImg from "/src/assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom"; // <-- NavLink hozzá
import { logout } from "../users";

export default function Navbar({ user, homePage, FAQ, aboutUs }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <header className="navbar align-items-end navbarStyle">
      <div className="container-fluid d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={logoImg}
            alt="logo"
            style={{ height: 40, width: 40, borderRadius: "50%" }}
          />
          <NavLink to={"/"}>
            <span className="fw-bold">
              <span style={{ color: "white" }}>U</span>
              <span style={{ color: "indianred" }}>S</span>ED
              <span style={{ color: "blue" }}>A</span>NIMALS.HU
            </span>
          </NavLink>
        </div>

        <nav className="d-flex justify-content-center gap-4 flex-grow-1">
          <NavLink to={homePage} className="navCenterLink">
            Kezdőoldal
          </NavLink>
          <NavLink to={FAQ} className="navCenterLink">
            GYIK
          </NavLink>
          <NavLink to={aboutUs} className="navCenterLink">
            Rólunk
          </NavLink>
        </nav>

        <div className="d-flex align-items-center gap-3 position-relative">
          <button
            className="btn btn-link p-0 text-dark"
            onClick={() => setOpenMenu((prev) => !prev)}
            style={{ fontSize: 20 }}
          >
            <i className="bi bi-person-circle" />
          </button>
          {isLoggedIn && (
            <>
              <button
                type="button"
                className="btn btn-link p-0 text-dark"
                data-bs-toggle="modal"
                data-bs-target="#createPostModal"
                style={{ fontSize: 20 }}
              >
                +
              </button>
              <button
                className="btn btn-link p-0 text-dark"
                onClick={handleLogout}
                style={{ fontSize: 20 }}
              >
                <i className="bi bi-box-arrow-right" />
              </button>
            </>
          )}
          {openMenu && (
            <div className="user-dropdown">
              {!isLoggedIn && (
                <button
                  className="user-dropdown-item"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/login");
                  }}
                  style={{ fontSize: 20 }}
                >
                  Bejelentkezés / Regisztráció
                </button>
              )}
              {isLoggedIn && (
                <>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/messages");
                    }}
                    style={{ fontSize: 20 }}
                  >
                    Üzenetek
                  </button>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/profile");
                    }}
                    style={{ fontSize: 20 }}
                  >
                    Profil Beállitások
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
