import { useState } from "react";
import Navbar from "../components/Navbar";
export default function Admin() {
  const [user, setUser] = useState(null);
  const ads = [
    {
      id: 1,
      userName: "kaki",
      adTitle: "iPhone 14 Pro Max",
      adImage: "https://picsum.photos/seed/phone/200/200",
      adCategory: "Elektronika",
    },
    {
      id: 2,
      userName: "user42",
      adTitle: "Eladó laptop - Dell XPS",
      adImage: "https://picsum.photos/seed/laptop/200/200",
      adCategory: "Elektronika",
    },
    {
      id: 3,
      userName: "teszt_user",
      adTitle: "Bútor szett olcsón",
      adImage: "https://picsum.photos/seed/furniture/200/200",
      adCategory: "Otthon",
    },
  ];
  return (
    <div className="admin-page">
      <Navbar user={user} homePage={"/"} />
      <h1 className="admin-title">Admin panel</h1>
      <p className="admin-subtitle">Felhasználók és hirdetések kezelése</p>
      <div className="search-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Keresés...."
        />
        <i className="bi bi-search search-icon" />
      </div>
      <div className="admin-table-wrapper">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Felhasználó</th>
              <th scope="col">Hirdetés</th>
              <th scope="col" className="text-center">
                Müvelet
              </th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {ads.map((ad) => (
              <tr key={ad.id}>
                <th scope="row">{ad.id}</th>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {ad.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{ad.userName}</span>
                  </div>
                </td>
                <td>
                  <div className="ad-preview">
                    <img
                      src={ad.adImage}
                      alt={ad.adTitle}
                      className="ad-preview-img"
                    />
                    <div className="ad-preview-info">
                      <span className="ad-preview-name">{ad.adTitle}</span>
                      <span className="ad-preview-sub">{ad.adCategory}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    <button className="btn-action btn-action-view">
                      <i className="bi bi-eye" />
                      <span>Megtekintés</span>
                    </button>
                    <button className="btn-action btn-action-delete">
                      <i className="bi bi-trash3" />
                      <span>Törlés</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
