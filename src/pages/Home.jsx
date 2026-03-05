import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Home.css";
import { whoami } from "../users";
import { loadpost } from "../animals";
import UserPosts from "../components/UserPosts";
export default function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await whoami();
        if (!data?.error) {
          setUser(data);
        }
        toast.error(data.error);
      } catch (err) {
        toast.error(err.message);
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
        toast.error(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);
  // console.log("posts state:", posts, Array.isArray(posts))
  toast.info(loading);
  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2500} />
      <Navbar user={user} homePage={"/"} FAQ={"/"} aboutUs={"/"} />
      <CreatePost />
      <Outlet />
      <div className="ua-page ">
        <div className="container-fluid px-4">
          <div className="ua-layout ">
            <aside className="ua-filter">
              <h3>Szűrők</h3>
            </aside>

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
