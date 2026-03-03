import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import { whoami } from "../users";
import UserPosts from "../components/UserPosts";
export default function Home() {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await whoami();
      if (!data?.error) {
        setUser(data);
      }
      setUserError(data);
    }
    load();
  }, []);
  return (
    <>
      <Navbar user={user} homePage={"/"} FAQ={"/"} aboutUs={"/"} />
      <div className="ua-page ">
        <div className="container-fluid px-4">
          <div className="ua-layout ">
            <aside className="ua-filter">
              <h3>Szűrők</h3>
            </aside>

            <section className="ua-posts">
              <div className="ua-cards-grid">
                <UserPosts />
                <UserPosts />
                <UserPosts />
                <UserPosts />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
