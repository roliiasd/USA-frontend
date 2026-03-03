import logoImg from "/src/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../users";
import Btn from "./Btn";
export default function Navbar({ user, homePage, FAQ, aboutUs }) {
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
    <div className="container-fluid px-4">
    <div className="d-flex align-items-center justify-content-between py-3">
      <img
        src={logoImg}
        alt="logo"
        className="img img-fluid"
        style={{ height: 50, width: 50 }}
      />
      {/* /home */}

      <div className="d-flex  align-items-center gap-3">
        <Link
          to={"/"}
          className="px-3 py-1 text-decoration-none text-dark rounded"
          style={{ fontSize: 20, background: "lightgray" }}
        >
          Kezdőoldal
        </Link>
        {isLoggedIn ? (
          <>
            {/* /Kepeim */}
            <Link
              to={"/mygallery"}
              className="px-3 py-1 text-decoration-none text-dark rounded"
              style={{ fontSize: 20 }}
            >
              GYÍK
            </Link>
            {/* /Fiokom */}
            <Link
              to={"/abouto"}
              className="px-3 py-1 text-decoration-none text-dark rounded"
              style={{ fontSize: 20 }}
            >
              Rólunk
            </Link>
            {/* /loginlogout/ */}
            <Btn btnClass={"btn btn-dark px-4"} btnContent={'Kijelentkezés'} onClick={()=>handleLogout()} />
          </>
        ) : (
          <Link to={'/login'} className={'btn btn-dark px-4'}>Belépés</Link>
        )}
        
      </div>
    </div>
    <hr className="m-0"/>
  </div>
  );
}
