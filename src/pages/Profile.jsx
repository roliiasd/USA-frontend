import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPosts from "../components/UserPosts";
import { whoami } from "../users";
import { loadpost } from "../animals";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    async function loadProfileData() {
      try {
        const me = await whoami();
        if (me.error) {
          navigate("/login");
          return;
        }
        setUser(me);

        const allPosts = await loadpost();
        setMyPosts(allPosts.filter((post) => post.userId === me.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [navigate]);

  // console.log(user)
  // console.log(myPosts)

  const handleEdit = (postId) => {
    console.log("Edit:", postId);
  };
  return (
    <>
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
          <h1>Jocoka,</h1>
          <i className="bi bi-person-fill" />
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
              Hirdetéseim
            </button>
          </div>
          {activeTab === "settings" && (
            <div className="profile-settings d-flex flex-column">
              <label>Felhasználónév megváltoztatása</label>
              <input
                type="text"
                className="form-control-lg mb-4"
                placeholder="Kivánt név....."
              />
              <label>Jelszó megváltoztatása</label>
              <input
                type="password"
                className="form-control-lg mb-4"
                placeholder="Új jelszó megadása"
              />
              <input
                type="password"
                className="form-control-lg mb-lg-5"
                placeholder="Új jelszó megerősitése"
              />
              <div className="d-flex mx-5 settingsBtn">
                <button className="btn btn-danger">Elvetés</button>
                <button className="btn btn-success">Mentés</button>
              </div>
            </div>
          )}
          {activeTab === "posts" && (
            <div className="profile-cards-grid d-flex">
              {myPosts.length === 0 ? (
                <p className="no-posts">Még nincs hirdetésed</p>
              ) : (
                myPosts.map((post) => (
                  <div key={post._id} className="profile-card-wrapper gap-2">
                    <UserPosts
                      username={myPosts.username}
                      petImg={myPosts.petImg}
                      petName={myPosts.nev}
                      note={myPosts.note}
                      locationText={[
                        myPosts.megye,
                        myPosts.varos,
                        myPosts.postcode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() => handleEdit(post.id)}
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
