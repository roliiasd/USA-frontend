import { useState } from "react";

import { Link } from "react-router";
import "../styles/Registration.css";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [message, setMessage] = useState("");
  
  const handleRegister = async () => {
    if (!username || !email || !psw) {
      setMessage("Minden mezőt ki kell tölteni");
      return;
    }
    if (psw !== confirmPsw) {
      setMessage("A jelszavak nem egyeznek");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, psw }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Sikeres regisztráció");
        setUsername("");
        setEmail("");
        setPsw("");
        setConfirmPsw("");
      } else {
        setMessage(data.message || "Hiba történt");
      }
    } catch (err) {
      console.log(err);
      setMessage("Nem sikerült kapcsolódni a szerverhez!");
    }
  };

  return (
    <>
      <div className="reg-page">
        <Link to={"/"} className="img-div">
            <img src="/src/assets/logo.png" alt="UsedAnimals logo" />
        </Link>

        <div className="reg-content">
          <h1>Üdvözöljük!</h1>

          <div className="reg-box">
            <input
              type="text"
              value={username}
              placeholder="Írj be egy felhasználónevet..."
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              value={email}
              placeholder="Ide írd az email címed..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={psw}
              placeholder="Írj be egy jelszót..."
              onChange={(e) => setPsw(e.target.value)}
            />
            <input
              type="password"
              value={confirmPsw}
              placeholder="Jelszó megerősítése"
              onChange={(e) => setConfirmPsw(e.target.value)}
            />

            {message && <p className="message">{message}</p>}

            <div className="reg-Btn" onClick={handleRegister}>
              Regisztráció
            </div>
          </div>
          <p className="log-reg">
            Ha van fiókod,{" "}
            <Link to={"/login"} style={{ textDecoration: "none" }}>
              <span>Lépj be!</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
