import { useEffect, useState, useMemo, useCallback } from "react";
import { delAnim, loadpost } from "../utils/animals";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { roleChange } from "../utils/users";
import { toast, ToastContainer } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";

//     =
//   imagehelper    =
//     =
function getImageUrl(images) {
  if (!images || images.length === 0) return "/placeholder.png";
  const firstImage = images[0];
  return firstImage.url ? `/${firstImage.url}` : `/${firstImage}`;
}

const LoadingSpinner = () => (
  <div className="loading-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);
export default function Admin() {
  const { user, loading: authLoading, onLogout } = useAuth();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);

  //     =
  //    posts          =
  //                       =
  //     =
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const minLoadingTime = 2000;
    const startTime = Date.now();
    try {
      const result = await loadpost();
      const elapsed = Date.now() - startTime;
      const remaining = minLoadingTime - elapsed;
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }
      setAds(result);
    } catch (err) {
      console.error(err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);
  //      =
  // handlereshreh     =
  //     =
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchPosts();
    }
  }, [fetchPosts, authLoading, user?.role]);
  //     =
  //  confirm delete function     =
  //     =
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await delAnim(deleteTarget.id);
      setAds((prev) => prev.filter((ad) => ad.id !== deleteTarget.id));
      toast.info("Hirdetes torolve!");
    } catch (err) {
      console.error(
        "nemtudsz torolni mer hoki vagy, vagy csak gatyesz van a szeroval ink a masodik",
        err
      );
      toast.error(
        "nemtudsz torolni mer hoki vagy, vagy csak gatyesz van a szeroval ink a masodik"
      );
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget]);
  const confirmRoleChange = useCallback(async () => {
    if (!roleTarget) return;

    const newRole = roleTarget.role === "admin" ? "user" : "admin";
    const oldRole = roleTarget.role;
    const targetUserId = roleTarget.userId;
    const currentUserId = user?.id;

    try {
      setAds((prev) =>
        prev.map((ad) =>
          ad.userId === targetUserId ? { ...ad, role: newRole } : ad
        )
      );

      const data = await roleChange(targetUserId, newRole);

      if (data.error) {
        console.error(data.error);
        // Visszaállítás
        setAds((prev) =>
          prev.map((ad) =>
            ad.userId === targetUserId ? { ...ad, role: oldRole } : ad
          )
        );
        toast.error(" Nem Sikerült");
        return;
      }
      toast.info("Sikerült");
      if (
        currentUserId &&
        targetUserId === currentUserId &&
        newRole === "user"
      ) {
        toast.info("Kijelentkezés....");
        await onLogout();
        navigate("/login");
      }
    } catch (err) {
      console.error("Nem sikerült módosítani:", err);
      setAds((prev) =>
        prev.map((ad) =>
          ad.userId === targetUserId ? { ...ad, role: oldRole } : ad
        )
      );
    } finally {
      setRoleTarget(null);
    }
  }, [roleTarget, user?.id, onLogout, navigate]);
  //     =
  //       =
  //     =
  const filteredAds = useMemo(() => {
    if (!search.trim()) return ads;
    const term = search.toLowerCase();
    return ads.filter(
      (ad) =>
        ad.nev?.toLowerCase().includes(term) ||
        ad.username?.toLowerCase().includes(term) ||
        ad.megjegyzes?.toLowerCase().includes(term)
    );
  }, [ads, search]);

  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      toast.error("Nincs jogosultságod!", {
        autoClose: 2000,
        onClose: () => navigate("/"),
      });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <>
        <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
        <div className="admin-page">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (user.role !== "admin") {
    return (
      <>
        <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
        <div className="admin-page">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" autoClose={800} />
      <div className="admin-page">
        <Navbar user={user} homePage={"/"} FAQ={"/faq"} aboutUs={"/aboutus"} />
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
        {loading ? (
          <LoadingSpinner />
        ) : (
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
                    <td colSpan={"5"}>
                      <div className="empty-state">
                        <i className="bi bi-inbox" />
                        <p>Ures he</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((ad) => (
                    // console.log("AD objektum:", ad),
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
                            src={getImageUrl(ad.images)}
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
                            onClick={() => setDeleteTarget(ad)}
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
                            onChange={() => setRoleTarget(ad)}
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
        )}

        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Törlés megerősítése"
          message="Biztosan törölni szeretnéd ezt a hirdetést?"
          confirmText="Törlés"
          icon={<i className="bi bi-trash3" />}
        >
          {deleteTarget && (
            <div className="modal-ad-preview">
              <img
                src={getImageUrl(deleteTarget.images)}
                alt={deleteTarget.nev}
              />
              <span>{deleteTarget.nev}</span>
            </div>
          )}
        </ConfirmModal>
        <ConfirmModal
          isOpen={!!roleTarget}
          onClose={() => setRoleTarget(null)}
          onConfirm={confirmRoleChange}
          title="Szerepkör módosítása"
          message={`Biztos módosítani szeretnéd ${roleTarget?.username} szerepkörét?`}
          confirmText="Módosítás"
          icon={<i className="bi bi-shield-lock" />}
        >
          {roleTarget && (
            <div className="modal-role-preview">
              <span
                className={`modal-role-badge modal-role-badge-${roleTarget.role}`}
              >
                {roleTarget.role}
              </span>
              <i className="bi bi-arrow-right modal-role-arrow" />
              <span
                className={`modal-role-badge modal-role-badge-${
                  roleTarget.role === "admin" ? "user" : "admin"
                }`}
              >
                {roleTarget.role === "admin" ? "user" : "admin"}
              </span>
            </div>
          )}
        </ConfirmModal>
      </div>
    </>
  );
}
