import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !psw) {
      setMessage("Minden mezot tölts ki!");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:4000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, psw }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Sikeresen beléptél!");
        setEmail("");
        setPsw("");
        navigate("/");
      } else {
        setMessage(data.message || "Hiba történt");
      }
    } catch (err) {
      setMessage("Nem sikerült kapcsolódni a szerverhez!");
    }
  };
  return (
    <>
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

            {message && <p className="message">{message}</p>}

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
