import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import { whoami } from "../users";
export default function Home() {
  const [user, setUser]= useState(null)
  const [userError, setUserError] = useState(null)

  useEffect(()=>{
    async function load(){
      const data =  await whoami()
      if (!data?.error) {
        setUser(data)

      }
      setUserError(data)
    }
    load()
  }, [])
  return (
    <>
      <Navbar user={user} homePage={"/"} FAQ={"/"} aboutUs={"/"} />
    </>
  );
}
