import { useState } from "react";

import { Bounce, ToastContainer, toast } from "react-toastify";

import { Link,useNavigate } from "react-router";
import "../styles/Registration.css";
import { login, register } from "../users";

export default function Registration() {
  const navigate = useNavigate()
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
      toast.error("Minden mezőt ki kell tölteni");
      return;
    }
    if (psw !== confirmPsw) {
      toast.error("A jelszavak nem egyeznek");
      return;
    }
    try {
      const data = await register(email, username, psw);
      if (data.error) {
        return toast.error(data.error)
      }

      toast.success(data.message)
      login(email,psw)
      setTimeout(() => navigate('/'),3000)
    } catch (err) {
      toast.error('Nem sikerult kapcsolodni a bukkitszerverhez!')
    }
  };

  return (
    <>
    <ToastContainer theme="dark" position="top-center" autoClose={2500}/>
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
