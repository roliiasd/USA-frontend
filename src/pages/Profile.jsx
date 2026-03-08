import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <>
      <div className="profile-page">
        <button
          className="btn backtohome position-fixed"
          style={{ top: 20, left: 20 }}
          onClick={() => navigate("/")}
        >
          <i className="bi bi-arrow-left me-2"></i>
        </button>
        <div
          className=" profile-layout"
        >
          <h1>Jocoka,</h1>
          <i className="bi bi-person-fill" />

          <label>Felhasználónév megváltoztatása</label>
          <input
            type="text"
            className="form-control-lg mb-4"
            placeholder="Kivánt név...."
          />

          <label>Jelszó megváltoztatása</label>
          <input
            type="password"
            placeholder="Új jelszó megadása"
            className="form-control-lg mb-3"
          />

          <input
            type="password"
            placeholder="Új jelszó megerősitése"
            className="form-control-lg mb-lg-5"
          />

          <div className="d-flex flex-row justify-content-around">
            <button className="btn btn-danger">Elvetés</button>
            <button className="btn btn-success">Mentés</button>
          </div>
        </div>
      </div>
    </>
  );
}
