import { useEffect, useState } from "react";
import { delAnim, loadpost } from "../animals";
import Navbar from "../components/Navbar";
import { logout, roleChange, whoami } from "../users";
import { toast, ToastContainer } from "react-toastify";
export default function Admin() {
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  //     =
  //       =
  //     =
useEffect(()=>
async function fetchUser() {
  try {
    const userData = await whoami()
    if (userData && !userData.error) {
      setUser(userData)
    }
  } catch (err) {
    console.error('user lekees hiba', err);
    
  }
})

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const result = await loadpost();
        setAds(result);
      } catch (err) {
        console.error(err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [refresh]);
  //     =
  //       =
  //     =
  function handleRefresh() {
    setRefresh((prev) => prev + 1);
  }
  //     =
  //       =
  //     =
  function openDeleteModal(ad) {
    setDeleteTarget(ad);
  }
  function closeDeleteModal() {
    setDeleteTarget(null);
  }
  //     =
  //       =
  //     =
  async function confirmDelete(id) {
    if (!deleteTarget) return;
    try {
      await delAnim(deleteTarget.id);
      setAds((prev) => prev.filter((ad) => ad.id !== deleteTarget.id));
    } catch (err) {
      console.error(
        "nemtudsz torolni mer hoki vagy, vagy csak gatyesz van a szeroval ink a masodik",
        err,
      );
    } finally {
      setDeleteTarget(null);
    }
  }
  function openRoleModal(ad) {
    setRoleTarget(ad);
  }
  function closeRoleModal() {
    setRoleTarget(null);
  }
  //     =
  //       =
  //     =
  async function confirmRoleChange() {
    if (!roleTarget) return;

    const newRole = roleTarget.role === "admin" ? "user" : "admin";
    const oldRole = roleTarget.role;
    const targetUserId = roleTarget.userId;
    const curentUserId = user?.id || user?.userId || user?.user_id;

    try {
      // Optimista update
      setAds((prev) =>
        prev.map((ad) =>
          ad.userId === targetUserId ? { ...ad, role: newRole } : ad,
        ),
      );

      // AWAIT HOZZÁADVA!
      const data = await roleChange(targetUserId, newRole);

      if (data.error) {
        console.error(data.error);
        // Visszaállítás
        setAds((prev) =>
          prev.map((ad) =>
            ad.userId === targetUserId ? { ...ad, role: oldRole } : ad,
          ),
        );
        return;
      }

      // Ha saját magunkról vettük el az admin jogot
      if (curentUserId && targetUserId === curentUserId && newRole === "user") {
        toast.info("Kijelentkezés....");
        await logout();
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Nem sikerült módosítani:", err);
      // Visszaállítás
      setAds((prev) =>
        prev.map((ad) =>
          ad.userId === targetUserId ? { ...ad, role: oldRole } : ad,
        ),
      );
    } finally {
      setRoleTarget(null);
    }
  }
  //     =
  //       =
  //     =
  const filteredAds = ads.filter((ad) => {
    const term = search.toLowerCase();
    return (
      ad.nev?.toLowerCase().includes(term) ||
      ad.username?.toLowerCase().includes(term) ||
      ad.note?.toLowerCase().includes(term)
    );
  });
  //     =
  //       =
  //     =
  if (loading) {
    return (
      <div className="loading">
        <span>Betöltés...</span>
      </div>
    );
  }
  return (
    <>
      <ToastContainer theme="light" autoClose={'800'}/>
      <div className="admin-page">
        <Navbar user={user} homePage={"/"} />
        <h1 className="admin-title">Admin panel</h1>
        <p className="admin-subtitle">Felhasználók és hirdetések kezelése</p>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            value={search}
            placeholder="Keresés...."
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="bi bi-search search-icon" />
        </div>
        <div className="admin-table-wrapper">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th scope="col">user#</th>
                <th scope="col">Felhasználó</th>
                <th scope="col">Hirdetés</th>
                <th scope="col" className="text-center">
                  Müvelet
                </th>
                <th scope="col">role</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={"4"}>
                    <div className="empty-state">
                      <i className="bi bi-inbox" />
                      <p>Ures he</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  // console.log(ad),
                  <tr key={ad.id}>
                    <th scope="row">{ad.id}</th>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {ad.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{ad.username}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ad-preview">
                        <img
                          src={ad.kep}
                          alt={ad.nev}
                          className="ad-preview-img"
                        />
                        <div className="ad-preview-info">
                          <span className="ad-preview-name">{ad.nev}</span>
                          <span className="ad-preview-sub">
                            {ad.megjegyzes}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: ".5rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="btn-action btn-action-delete"
                          onClick={() => openDeleteModal(ad)}
                        >
                          <i className="bi bi-trash3" />
                          <span>Törlés</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="role-toggle">
                        <input
                          type="checkbox"
                          className="role-switch"
                          checked={ad.role === "admin"}
                          onChange={() => openRoleModal(ad)}
                        />
                        <span
                          className={`role-label ${
                            ad.role === "admin"
                              ? "role-label-admin"
                              : "role-label-user"
                          }`}
                        >
                          {ad.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {deleteTarget && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">
                <i className="bi bi-trash3" />
              </div>
              <h2 className="modal-title">Törlés megerősitése</h2>
              <p className="modal-message">
                Biztosan törölni szeretnéd ezt a hirdetést? Ez a művelet nem
                vonható vissza.
              </p>
              <div className="modal-ad-preview">
                <img src={deleteTarget.kep} alt={deleteTarget.nev} />
                <span>{deleteTarget.nev}</span>
              </div>
              <div className="modal-buttons">
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={closeDeleteModal}
                >
                  Mégse
                </button>
                <button
                  className="modal-btn modal-btn-delete"
                  onClick={confirmDelete}
                >
                  <i className="bi bi-trash3" />
                  Törlés
                </button>
              </div>
            </div>
          </div>
        )}
        {roleTarget && (
          <div className="modal-overlay" onClick={closeRoleModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon-role">
                <i className="bi bi-shield-lock" />
              </div>
              <h2 className="modal-title">Admin v User</h2>
              <p className="modal-message">
                Biztos modositani szeretnéd{" "}
                <strong style={{ color: "#FFF" }}>{roleTarget.username}</strong>{" "}
                szerepkörét?
              </p>
              <div className="modal-role-preview">
                <span
                  className={`modal-role-badge ${
                    roleTarget.role === "admin"
                      ? "modal-role-badge-admin"
                      : "modal-role-badge-user"
                  }`}
                >
                  {roleTarget.role}
                </span>
                <i className="bi bi-arrow-right modal-role-arrow" />
                <span
                  className={`modal-role-badge ${
                    roleTarget.role === "admin"
                      ? "modal-role-badge-user"
                      : "modal-role-badge-admin"
                  }`}
                >
                  {roleTarget.role === "admin" ? "user" : "admin"}
                </span>
              </div>
              <div className="modal-buttons">
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={closeRoleModal}
                >
                  Mégse
                </button>
                <button
                  className="modal-btn modal-btn-confirm"
                  onClick={confirmRoleChange}
                >
                  <i className="bi bi-check-lg" />
                  Módositás
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
