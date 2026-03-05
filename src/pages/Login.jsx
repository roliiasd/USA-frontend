import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { login } from "../users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !psw) {
      toast.error('Minden mezőt tölts ki!')
      return;
    }
    try {
      const data = await login(email, psw);
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.message === "YIPPIE") {
        toast.success(data.message)
        setTimeout(() => navigate('/'),2500)
        return;
      }
    } catch (err) {
      toast.error("Nem sikerult kapcsolodni a bukkitszerverhez!");
    }
  };

  return (
    <>
    <ToastContainer theme="dark" position="top-center" autoClose={2000}/>
      <div className="login-page">
        <div className="img-div">
          <img src="/src/assets/logo.png" alt="" />
        </div>

        <div className="login-content">
          <h1>Üdvözöljük!</h1>

          <div className="login-box">
            <input
              type="email"
              value={email}
              placeholder="Add meg az emailed"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={psw}
              placeholder="Add meg a jelszavad"
              onChange={(e) => setPsw(e.target.value)}
            />

            <div className="login-Btn" onClick={handleLogin}>
              Bejelentkezés
            </div>
          </div>

          <p className="log-reg">
            Ha még nincs fiókod,{" "}
            <Link to={"/registration"} style={{ textDecoration: "none" }}>
              <span>Regisztrálj be!</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
