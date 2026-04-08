import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserPosts from "../components/UserPosts";
import EditPost from "../components/EditPost";
import { whoami, editName, editPassword } from "../utils/users";
import { loadpost } from "../utils/animals";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [psw, setPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editingPost, setEditingPost] = useState(null);

  const navigate = useNavigate();

  async function loadProfileData() {
    try {
      const me = await whoami();
      if (me.error) {
        navigate("/login");
        return;
      }
      setCurrentUser(me);

      const allPosts = await loadpost();
      console.log("osszes post: ", allPosts);

      const posts = Array.isArray(allPosts) ? allPosts : [];
      const filtered = posts.filter(
        (post) => Number(post.userId) === Number(me.user_id),
      );
      // console.log("sajat posztok:", filtered);
      // console.log("elso post images", filtered[0]?.images);

      setMyPosts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  async function editProfile() {
    try {
      if (psw && psw !== confirmPsw) {
        toast.error("A jelszavak nem egyeznek");
        return;
      }
      if (username && username.trim() !== "") {
        const nameResult = await editName(username);
        if (nameResult.error) {
          toast.error(nameResult.error);
          return;
        }
        setCurrentUser((prev) => ({
          ...prev,
          username: nameResult.updatedUser?.username || username,
        }));
      }
      if (psw && psw.trim() !== "") {
        const pswResult = await editPassword(psw);
        if (pswResult.error) {
          toast.error(pswResult.error);
          return;
        }
      }
      toast.success("Mentve ✓");
      setPsw("");
      setConfirmPsw("");
      setUsername("");
    } catch (err) {
      toast.error("Hiba történt");
    }
  }

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={500} theme="dark" />

      <div className="profile-page">
        <aside className="profile-sidebar">
          <button className="sidebar-btn" onClick={() => navigate("/")}>
            <i className="bi bi-house-door" />
            <span>Főoldal</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bi bi-person" />
            <span>Profil</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            <i className="bi bi-grid" />
            <span>Hirdetéseim</span>
          </button>
        </aside>

        <main className="profile-main">
          <div className="profile-content">
            {activeTab === "profile" && (
              <>
                <h1>{currentUser?.username || "Felhasználó"}</h1>

                <div className="settings-panel">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editProfile();
                    }}
                  >
                    <label>Felhasználónév</label>
                    <input
                      type="text"
                      value={username}
                      placeholder={currentUser?.username || "Új név..."}
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Új jelszó</label>
                    <input
                      type="password"
                      value={psw}
                      placeholder="••••••••"
                      onChange={(e) => setPsw(e.target.value)}
                    />

                    <label>Jelszó megerősítése</label>
                    <input
                      type="password"
                      value={confirmPsw}
                      placeholder="••••••••"
                      onChange={(e) => setConfirmPsw(e.target.value)}
                    />

                    <div className="settings-buttons">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setUsername("");
                          setPsw("");
                          setConfirmPsw("");
                        }}
                      >
                        Elvetés
                      </button>
                      <button type="submit" className="btn-save">
                        Mentés
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeTab === "posts" && (
              <>
                <h1>Hirdetéseim ({myPosts.length})</h1>

                {myPosts.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-inbox" />
                    <p>
                      Még nincs hirdetésed,{" "}
                      <Link
                        to={"/"}
                        className="text-decoration-none text-danger fst-italic"
                      >
                        ugorj a főoldalra
                      </Link>
                      !
                    </p>
                  </div>
                ) : (
                  <div className="posts-grid">
                    {myPosts.map((post) => (
                      <div key={post.id} className="post-card">
                        <UserPosts
                          id={post.id}
                          username={currentUser?.username}
                          petImg={post.images}
                          petName={post.nev}
                          note={post.megjegyzes}
                          county={post.megye}
                          city={post.varos}
                          postcode={post.postcode}
                          send_a_message={""}
                        />
                        <div className="post-card-footer">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingPost(post)}
                          >
                            <i className="bi bi-pencil me-2" />
                            Szerkesztés
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <EditPost
        editData={editingPost}
        onClose={() => setEditingPost(null)}
        onSuccess={() => {
          setEditingPost(null);
          loadProfileData();
        }}
      />
    </>
  );
}
