import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Home.css";
import { whoami } from "../users";
import { loadpost } from "../animals";
import UserPosts from "../components/UserPosts";
import Filter from "../components/Filter";
export default function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({
    county: null,
    city: null,
    postcode: null,
  });
  // console.log("filters.county:", filters.county);
  // console.log("first post:", posts?.[0]);

  useEffect(() => {
    async function load() {
      try {
        const data = await whoami();
        if (!data?.error) {
          setUser(data);
        }
        // console.error(data.error);
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
    const countyOk = !filters.county || post.megye === filters.county.label;
    const cityOk = !filters.city || post.varos === filters.city.value;
    const postcodeOk =
      !filters.postcode ||
      String(post.postcode) === String(filters.postcode.value);
    return countyOk && cityOk && postcodeOk;
  });
// console.log(filteredPosts);
  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2500} />
      <Navbar user={user} homePage={"/"} FAQ={"/"} aboutUs={"/"} />
      <CreatePost onSuccess={handleRefresh} />
      <div className="ua-page ">
        <div className=" px-4">
          <div className="ua-layout ">
            <Filter filters={filters} setFilters={setFilters} />

            <section className="ua-posts">
              <div className="ua-cards-grid">
                {(filteredPosts ?? []).map((post) => (
                  <UserPosts
                    key={post.id}
                    username={post.username}
                    petImg={post.kep}
                    petName={post.nev}
                    note={post.megjegyzes}
                    county={post.megye}
                    city={post.varos}
                    postcode={post.postcode}
                    user={user}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
