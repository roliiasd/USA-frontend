import { useState } from "react";

import { Link } from "react-router";
import "../styles/Registration.css";
import { register } from "../users";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const [message, setMessage] = useState("");
  const [errorM, setErrorM] = useState("");

  const handleRegister = async () => {
    setErrorM('')
    setMessage('')
    if (!username || !email || !psw) {
      setErrorM("Minden mezőt ki kell tölteni");
      return;
    }
    if (psw !== confirmPsw) {
      setErrorM("A jelszavak nem egyeznek");
      return;
    }
    try {
      const data = await register(email, username, psw);
      if (data.error) {
        setErrorM(data.error)
      }
      setMessage(data.message)
    } catch (err) {
      setErrorM('Nem sikerult kapcsolodni a bukkitszerverhez!')
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

            {errorM && <div className="alert alert-danger text-center my-2">{errorM}</div>}
            {message && <div className="alert alert-success text-center my-2">{message}</div>}

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
