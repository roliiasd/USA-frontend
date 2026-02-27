import Navbar from "../components/Navbar";
import "/src/styles/Home.css";
export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="navbarContainer">
          <Navbar homePage={"/"} FAQ={"/"} aboutUs={"/"} />
        </div>
      </nav>
    </>
  );
}
