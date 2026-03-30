import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../users";
import logo from '../assets/logo.png'

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    psw: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    const { email, psw } = formData;

    if (!email || !psw) {
      toast.error("Minden mezőt tölts ki!");
      return false;
    }

    return true;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const data = await login(formData.email, formData.psw);
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.message === "YIPPIE") {
        toast.success(data.message);
        setTimeout(() => navigate("/"), 1500);
        return;
      }
    } catch (err) {
      toast.error("Nem sikerult kapcsolodni a bukkitszerverhez!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" autoClose={1000} />
      <div className="login-page">
        <Link to={"/"} className="img-div">
          <img src={logo} alt="" />
        </Link>

        <div className="login-content">
          <h1>Üdvözöljük!</h1>

          <form className="login-box" noValidate onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Add meg az emailed"
              onChange={handleChange}
            />
            <input
              type="password"
              name="psw"
              value={formData.psw}
              placeholder="Add meg a jelszavad"
              onChange={handleChange}
            />

            <button type="submit" className="login-Btn" disabled={isLoading}>
              {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
            </button>
          </form>

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
