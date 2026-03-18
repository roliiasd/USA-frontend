import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import { ToastContainer } from "react-toastify";
import "../styles/Home.css";
import { whoami } from "../users";
import { loadpost } from "../animals";
import UserPosts from "../components/UserPosts";
import Filter from "../components/Filter";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({
    county: null,
    city: null,
    postcode: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await whoami();
        if (!data?.error) {
          setUser(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await loadpost();
        setPosts(result);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [refresh]);

  function handleRefresh() {
    setRefresh((prev) => prev + 1);
  }

  const filteredPosts = (posts ?? []).filter((post) => {
    // console.log('post user_id: ', post.userId);
    const countyOk = !filters.county || post.megye === filters.county.label;
    const cityOk = !filters.city || post.varos === filters.city.value;
    const postcodeOk =
      !filters.postcode ||
      String(post.postcode) === String(filters.postcode.value);
    return countyOk && cityOk && postcodeOk;
  });

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={800} />

      <Navbar
        user={user}
        homePage={"/"}
        FAQ={"/"}
        aboutUs={"/"}
        onCreatePost={() => setShowCreateModal(true)}
      />

      {/* Új hirdetés modal */}
      <CreatePost
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleRefresh}
      />

      <div className="ua-page">
        <div className="container-fluid px-4">
          <div className="row g-3">
            <div className="col-12 col-lg-4 col-xl-3">
              <Filter filters={filters} setFilters={setFilters} />
            </div>

            <div className="col-12 col-lg-8 col-xl-9">
              <div className="ua-cards-grid w-100">
                {filteredPosts
                  .slice()
                  .reverse()
                  .map((post) => (
                    <UserPosts
                      key={post.id}
                      username={post.username}
                      postUserId={post.userId }
                      petImg={post.kep || [post.kep]}
                      petName={post.nev}
                      note={post.megjegyzes}
                      county={post.megye}
                      city={post.varos}
                      postcode={post.postcode}
                      user={user}
                      send_a_message={
                        <i
                          className="bi bi-chat"
                          style={{ color: "#f7b32bff" }}
                        />
                      }
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
