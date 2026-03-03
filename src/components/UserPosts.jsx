// src/components/UserPostCard.jsx
import pfp from "../assets/sddefault.jpg";
import ceca from "../assets/download.jpg";

export default function UserPosts() {
  return (
    <article className="ua-card">
      <header className="ua-card-header">
        <div className="ua-card-avatar-circle">
          <i className="bi bi-person-fill" />
        </div>
        <span className="ua-card-username">Jocóka</span>
      </header>
      <div className="ua-card-image">
        <img src={ceca} alt="ceca" />
      </div>
      <footer className="ua-card-footer">
        <div className="ua-card-title-row">
          <div className="ua-pet-name">Öcsipók</div>
          <button
            className="ua-edit-btn"
            type="button"
            aria-label="Hirdetés szerkesztése"
          >
            <i className="bi bi-pencil-fill" />
          </button>
        </div>
        <div className="ua-note-label">Megjegyzés:</div>
        <div className="ua-note-box">ciciciiciciciicica</div>
        <div className="ua-location-row">
          <i className="bi bi-geo-alt-fill" />
          <span>Hajdú-Bihar megye, Debrecen</span>
        </div>
      </footer>
    </article>
  );
}
