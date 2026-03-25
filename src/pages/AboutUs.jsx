import { useState } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";

export default function AboutUs() {
  const [trollMode, setTrollMode] = useState(false);

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={800} />

      <Navbar homePage={"/"} FAQ={"/faq"} aboutUs={"/aboutus"} />

      <div className={`uap-page ${trollMode ? "uap-troll" : ""}`}>
        {/* Theme Switch */}
        <div className="uap-theme-toggle">
          <span className="uap-toggle-label">
            {trollMode ? "bro mode" : "Normal"}
          </span>
          <label className="uap-toggle-switch">
            <input
              type="checkbox"
              checked={trollMode}
              onChange={() => setTrollMode(!trollMode)}
            />
            <span className="uap-slider"></span>
          </label>
        </div>

        <div className="uap-wrapper">
          {/* Logo */}
          <div className="uap-logo-container">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl7n7R8uX6iSppOGqVQBomifQrgKV1hFskpA&s"
              alt="UsedAnimals Logo"
              className="uap-logo"
            />
          </div>

          <h1 className="uap-main-title">
            {trollMode
              ? "ABOUT US no cap (with sole exception of Satoru Gojo)"
              : "About Us"}
          </h1>

          <div className="uap-box">
            {trollMode ? (
              <>
                <p className="uap-intro-text">
                  yo welcome to <span className="uap-brand">UsedAnimals</span>{" "}
                  we've been doing this for like 67 years (founded 2024 the math
                  is mathing trust)
                </p>

                <p className="uap-text">
                  two dudes, one google doc, zero business experience. we're
                  literally just vibing and selling pre-owned animals bro. it's
                  not that deep.
                </p>

                <blockquote className="uap-blockquote">
                  "one man's "he bites sometimes" is another man's "free
                  acupuncture" - Sun Tzu probably idk
                </blockquote>

                <p className="uap-text">
                  every animal goes through our inspection process. we check if
                  it's alive and if it got that dawg in him. that's basically it
                  bro.
                </p>

                <div className="uap-feature-box">
                  <h3>what we do (mostly)</h3>
                  <ul className="uap-feature-list">
                    <li>
                      sell u pets that previous owners gave up on (their loss)
                    </li>
                    <li>
                      provide emotional damage reports (free with every
                      purchase)
                    </li>
                    <li>30-day "it's still alive" guarantee</li>
                    <li>
                      Borzas personally sniffs each animal for quality control
                    </li>
                    <li>customer support (we try our best bro)</li>
                  </ul>
                </div>

                <p className="uap-text">returns? yeah sure whatever</p>
                <p className="uap-small-text">
                  *unless the pet has already trauma bonded to you then that's a
                  YOU problem
                </p>

                <p className="uap-highlight-text">
                  100% satisfaction or we'll write a passive aggressive tweet
                  about your ex. slay.
                </p>

                <div className="uap-team">
                  <h3 className="uap-team-title">the team (we're cooked)</h3>
                  <div className="uap-team-grid">
                    <div className="uap-team-card">
                      <div className="uap-team-avatar">✌</div>
                      <h4 className="uap-team-name">Borzas</h4>
                      <p className="uap-team-role">CEO (he's a dog)</p>
                      <span className="uap-team-status">
                        sleeps 18 hours a day. valid.
                      </span>
                    </div>
                    <div className="uap-team-card">
                      <div className="uap-team-avatar">✌</div>
                      <h4 className="uap-team-name">The Intern</h4>
                      <p className="uap-team-role">does literally everything</p>
                      <span className="uap-team-status">
                        paid in exposure and leftover pizza
                      </span>
                    </div>
                    <div className="uap-team-card">
                      <div className="uap-team-avatar">✌</div>
                      <h4 className="uap-team-name">Greg</h4>
                      <p className="uap-team-role">
                        we don't know what he does
                      </p>
                      <span className="uap-team-status">
                        just kinda here bro
                      </span>
                    </div>
                  </div>
                </div>

                <p className="uap-closing-text">
                  we love all our customers equally (with sole exception of
                  Satoru Gojo)
                </p>

                <div className="uap-signature">
                  <p className="uap-signature-main">— UsedAnimals Gang</p>
                  <p className="uap-signature-sub">
                    eating good sleeping great can't lose
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="uap-intro-text">
                  Welcome to <span className="uap-brand">UsedAnimals</span> —
                  your trusted marketplace for finding new homes for beloved
                  pets.
                </p>

                <p className="uap-text">
                  Founded in 2024, we connect pet owners with loving families
                  looking to adopt. Our platform ensures safe, transparent, and
                  ethical pet rehoming.
                </p>

                <blockquote className="uap-blockquote">
                  "Every animal deserves a loving home."
                </blockquote>

                <div className="uap-feature-box">
                  <h3>Our Services</h3>
                  <ul className="uap-feature-list">
                    <li>Verified pet listings</li>
                    <li>Secure messaging system</li>
                    <li>Health documentation support</li>
                    <li>Adoption guidance</li>
                    <li>Community support</li>
                  </ul>
                </div>

                <p className="uap-text">
                  We believe in responsible pet ownership and work tirelessly to
                  ensure every animal finds the perfect match.
                </p>

                <div className="uap-team">
                  <h3 className="uap-team-title">Our Team</h3>
                  <div className="uap-team-grid">
                    <div className="uap-team-card">
                      <h4 className="uap-team-name">Mészáros Nimród</h4>
                      <p className="uap-team-role">Backend</p>
                    </div>
                    <div className="uap-team-card">
                      <h4 className="uap-team-name">Kovács Roland</h4>
                      <p className="uap-team-role">Frontend</p>
                    </div>
                  </div>
                </div>

                <div className="uap-signature">
                  <p className="uap-signature-main">— The UsedAnimals Team</p>
                </div>
              </>
            )}
          </div>
        </div>

        {trollMode && (
          <div className="uap-chaos-bg">
            <span
              className="uap-float-emoji"
              style={{ left: "10%", animationDelay: "0s" }}
            >
              ✌
            </span>
            <span
              className="uap-float-emoji"
              style={{ left: "30%", animationDelay: "2s" }}
            >
              ✌
            </span>
            <span
              className="uap-float-emoji"
              style={{ left: "50%", animationDelay: "4s" }}
            >
              ✌
            </span>
            <span
              className="uap-float-emoji"
              style={{ left: "70%", animationDelay: "1s" }}
            >
              ✌
            </span>
            <span
              className="uap-float-emoji"
              style={{ left: "90%", animationDelay: "3s" }}
            >
              ✌
            </span>
          </div>
        )}
      </div>
    </>
  );
}
