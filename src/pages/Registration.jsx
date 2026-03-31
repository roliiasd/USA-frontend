import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../users";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const MIN_PSW_LENGTH = 7;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Registration() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    psw: "",
    confirmPsw: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, psw, confirmPsw } = formData;

    if (!username || !email || !psw || !confirmPsw) {
      toast.info("Minden mezőt ki kell tölteni");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.info("Érvénytelen email cím formátum!");
      return false;
    }

    if (psw.length < MIN_PSW_LENGTH) {
      toast.info(
        `A jelszónak legalább ${MIN_PSW_LENGTH} karakter hosszúnak kell lennie`
      );
      return false;
    }

    if (psw !== confirmPsw) {
      toast.info("A jelszavak nem egyeznek");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { email, username, psw } = formData;
      const data = await register(email, username, psw);
      if (data.error) {
        return toast.error(data.error);
      }
      const loginData = await login(email, psw);
      if (loginData?.error) {
        return toast.error(
          "Regisztráció sikeres, de az automatikus bejelentkezés nem sikerult"
        );
      }
      await refetchUser()
      toast.success(data.message);
      await login(email, psw);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Nem sikerült kapcsolódni a szerverhez!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" autoClose={1000} />
      <div className="reg-page">
        <Link to={"/"} className="img-div">
          <img src={logo} alt="UsedAnimals logo" />
        </Link>

        <div className="reg-content">
          <h1>Üdvözöljük!</h1>

          <form className="reg-box" noValidate onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Írj be egy felhasználónevet..."
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Ide írd az email címed..."
              onChange={handleChange}
            />
            <input
              type="password"
              name="psw"
              value={formData.psw}
              placeholder="Írj be egy jelszót..."
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPsw"
              value={formData.confirmPsw}
              placeholder="Jelszó megerősítése"
              onChange={handleChange}
            />

            <button type="submit" className="reg-Btn" disabled={isLoading}>
              {isLoading ? "Regisztráció...." : "Regisztráció"}
            </button>
          </form>
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
