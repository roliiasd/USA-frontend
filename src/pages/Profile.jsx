import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserPosts from "../components/UserPosts";
import CreatePost from "../components/CreatePost";
import { whoami, editUser } from "../users";
import { loadpost } from "../animals";
export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [psw, setPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");
  const [editingPost, setEditingPost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfileData() {
      try {
        const me = await whoami();

        // console.log(me);

        if (me.error) {
          navigate("/login");
          return;
        }
        setCurrentUser(me);

        const allPosts = await loadpost();

        const posts = Array.isArray(allPosts) ? allPosts : [];

        const myUserId = me.user_id;

        // console.log(myUserId);

        const filtered = posts.filter((post) => {
          return Number(post.userId) === Number(myUserId);
        });

        // console.log(`Szurt posztok: ${filtered}`);

        setMyPosts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [navigate]);

  async function editProfile() {
    try {
      const data = await editUser(username, psw);
      if (psw !== confirmPsw) {
        toast.error(data.error);
        return;
      }
      const updateData = {
        username: username,
        ...(psw && { password: psw }),
      };
      await editUser(updateData);
      toast.info(data.message);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }
  function handleCancel() {
    setUsername(currentUser?.username || "");
    setPsw("");
    setConfirmPsw("");
  }
  // console.log(user);
  // console.log(myPosts);
  if (loading) {
    return <div className="loading">Betöltés....</div>;
  }
  const handleEdit = (post) => {
    setEditingPost(post);
  };
  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2000} />
      <div className="profile-page">
        <div className="profile-layout">
          <button
            className="btn backtohome position-fixed"
            style={{ top: 20, left: 20 }}
            onClick={() => navigate("/")}
          >
            <i className="bi  bi-house-down me-2" />
            Vissza a főoldalra
          </button>
          <h1>{currentUser?.username || currentUser?.name || "Felhasználó"}</h1>
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Beállitások
            </button>
            <button
              className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Hirdetéseim ({myPosts.length})
            </button>
          </div>
          {activeTab === "settings" && (
            <div className="profile-settings d-flex flex-column">
              <label>Felhasználónév megváltoztatása</label>
              <input
                value={username}
                type="text"
                className="form-control-lg mb-4"
                placeholder={currentUser?.username || "Kivánt név....."}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Jelszó megváltoztatása</label>
              <input
                value={psw}
                type="password"
                className="form-control-lg mb-4"
                placeholder="Új jelszó megadása"
                onChange={(e) => setPsw(e.target.value)}
              />
              <input
                value={confirmPsw}
                type="password"
                className="form-control-lg mb-lg-5"
                placeholder="Új jelszó megerősitése"
                onChange={(e) => setConfirmPsw(e.target.value)}
              />
              <div className="d-flex mx-5 settingsBtn">
                <button className="btn btn-danger" onClick={handleCancel}>
                  Elvetés
                </button>
                <button className="btn btn-success" onClick={editProfile}>
                  Mentés
                </button>
              </div>
            </div>
          )}
          {activeTab === "posts" && (
            <div className="profile-cards-grid d-flex">
              {myPosts.length === 0 ? (
                <p className="no-posts">Még nincs hirdetésed</p>
              ) : (
                myPosts.map((post) => (
                  <div key={post.id} className="profile-card-wrapper gap-2">
                    <UserPosts
                      username={currentUser?.username}
                      petImg={post.kep}
                      petName={post.nev}
                      note={post.megjegyzes}
                      locationText={[post.megye, post.varos, post.postcode]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <CreatePost
                      editData={editingPost}
                      onSuccess={() => {
                        setEditingPost(null);
                        loadProfileData();
                      }}
                      onClose={() => setEditingPost(null)}
                    />
                    <button
                      className="btn btn-outline-primary mt-2"
                      data-bs-toggle="modal"
                      data-bs-target="#createPostModal"
                      onClick={() => handleEdit(post)}
                    >
                      <i className="bi bi-pencil-fill me-2" />
                      Szerkesztés
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
