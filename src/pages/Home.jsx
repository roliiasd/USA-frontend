import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
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
    search : ''
  })

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

  useEffect(() => {
    async function filteredFetchPost() {
      try {
        const result = await filteredFetchPost()
        setPosts(result)
      } catch (error) {
        
      }
    }
  }, []);
  function handleRefresh() {
    x;
    setRefresh((prev) => prev + 1);
  }
  // console.log("posts state:", posts, Array.isArray(posts))
  toast.info(loading);
  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2500} />
      <Navbar user={user} homePage={"/"} FAQ={"/"} aboutUs={"/"} />
      <CreatePost onSuccess={handleRefresh} />
      <div className="ua-page ">
        <div className=" px-4">
          <div className="ua-layout ">
            <Filter filters={filters} setFilters={setFilters}/>

            <section className="ua-posts">
              <div className="ua-cards-grid">
                {(posts ?? []).map((post) => (
                  <UserPosts
                    key={post.id}
                    username={post.username}
                    petImg={post.kep}
                    petName={post.nev}
                    countyCity={post.varos}
                    note={post.megjegyzes}
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
