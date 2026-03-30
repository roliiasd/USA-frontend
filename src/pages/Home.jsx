import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import { ToastContainer } from "react-toastify";
import "../styles/Home.css";
import { whoami } from "../users";
import { loadpost } from "../animals";
import UserPosts from "../components/UserPosts";
import Filter from "../components/Filter";

const CHAT_ICON = <i className="bi bi-chat" style={{ color: "#f7b32bff" }} />;
const INITIAL_FILTERS = {
  county: null,
  city: null,
  postcode: null,
};
export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await whoami();
        if (!cancelled && data && !data.error) {
          setUser(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchPosts() {
      try {
        setLoading(true);
        const result = await loadpost();
        if (!cancelled) setPosts(result ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const handleRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  const filteredPosts = useMemo(() => {
    const { county, city, postcode } = filters;
    const hasAnyFilter = county || city || postcode;
    const list = hasAnyFilter
      ? posts.filter((post) => {
          if (county && post.megye !== county.label) return false;
          if (city && post.varos !== city.label) return false;
          if (postcode && post.postcode !== String(postcode.label))
            return false;
          return true;
        })
      : posts;
    return [...list].reverse();
  }, [posts, filters]);

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={800} />

      <Navbar
        user={user}
        homePage={"/"}
        FAQ={"/faq"}
        aboutUs={"/aboutus"}
        onCreatePost={() => setShowCreateModal(true)}
      />

      {/* Új hirdetés modal */}
      {showCreateModal && (
        <CreatePost
          showModal={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRefresh}
        />
      )}

      <div className="ua-page">
        <div className="container-fluid px-4">
          <div className="row g-3">
            <div className="col-12 col-lg-4 col-xl-3">
              <Filter filters={filters} setFilters={setFilters} />
            </div>

            <div className="col-12 col-lg-8 col-xl-9">
              {isLoading ? (
                <div className="text-center py-5">Betöltés...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-5">Nincs Találat</div>
              ) : (
                <div className="ua-cards-grid w-100">
                  {filteredPosts
                    .slice()
                    .reverse()
                    .map((post) => (
                      <UserPosts
                        key={post.id}
                        username={post.username}
                        postUserId={post.userId}
                        petImg={post.images}
                        petName={post.nev}
                        note={post.megjegyzes}
                        county={post.megye}
                        city={post.varos}
                        postcode={post.postcode}
                        user={user}
                        send_a_message={CHAT_ICON}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
