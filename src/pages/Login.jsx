import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login, forgotPassword } from "../utils/users";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    psw: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowforgotPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isResetting, setIsResetting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
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
        await refetchUser();
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { email, newPassword, confirmPassword } = resetData;

    if (!email || !newPassword || !confirmPassword) {
      toast.error("Minden mezőt tölts ki!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("A jelszavak nem egyeznek");
      return;
    }

    if (newPassword.length < 7) {
      toast.error("A jelszó legalább 7 karakter legyen");
      return;
    }
    setIsResetting(true);
    try {
      // const data = await forgotPassword(email, newPassword);
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Jelszó sikeresen módositva!");
      setShowforgotPassword(false);
      setResetData({ email: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Nem sikerült módositani a jelszót!");
    } finally {
      setIsResetting(false);
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
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Add meg az emailed"
              onChange={handleChange}
            />
            <input
              className="form-control"
              type="password"
              name="psw"
              value={formData.psw}
              placeholder="Add meg a jelszavad"
              onChange={handleChange}
            />
            <tt
              className="forgot-password-link"
              onClick={() => setShowforgotPassword(true)}
            >
              Elfelejtett jelszo
            </tt>
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
      {showForgotPassword && (
        <div
          className="modal-overlay"
          onClick={() => setShowforgotPassword(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowforgotPassword(false)}
            >
              x
            </button>
            <h2>Jelszó Visszaállítás</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                name="email"
                value={resetData.email}
                placeholder="Add meg az emailed"
                onChange={handleResetChange}
              />
              <input
                type="password"
                name="newPassword"
                value={resetData.newPassword}
                placeholder="Új jelszó"
                onChange={handleResetChange}
              />
              <input
                type="password"
                name="confirmPassword"
                value={resetData.confirmPassword}
                placeholder="Új jelszó megerősitése"
                onChange={handleResetChange}
              />

              <button type="submit" disabled={isResetting}>
                {isResetting ? "Mentés..." : "Jelszó módositása"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
