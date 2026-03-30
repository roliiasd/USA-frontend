import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import "../src/styles/Home.css";
import "../src/styles/Profile.css";
import "../src/styles/Navbar.css";
import "../src/styles/Filter.css";
import "../src/styles/CreatPosts.css";
import "../src/styles/EditPost.css";
import '../src/styles/Chat.css'
import '../src/styles/Admin.min.css'
import '../src/styles/NoXdAboutUs_FAQ.css'
import '../src/styles/XdAboutUs_FAQ.css'
import "../src/styles/Registration.css";
import "../src/styles/Login.css";

import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChatPages from "./pages/ChatPages";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatPages />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
