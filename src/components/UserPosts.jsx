
export default function UserPosts({username, petImg, petName, note, countyCity}) {
  return (
    <article className="ua-card">
      <header className="ua-card-header">
        <div className="ua-card-avatar-circle">
          <i className="bi bi-person-fill" />
        </div>
        <span className="ua-card-username">{username}</span>
      </header>
      <div className="ua-card-image">
        <img src={petImg} alt="ceca" />
      </div>
      <footer className="ua-card-footer">
        <div className="ua-card-title-row">
          <div className="ua-pet-name">{petName}</div>
          <button
            className="ua-edit-btn"
            type="button"
            aria-label="Hirdetés szerkesztése"
          >
            <i className="bi bi-pencil-fill" />
          </button>
        </div>
        <div className="ua-note-label">Megjegyzés:</div>
        <div className="ua-note-box">{note}</div>
        <div className="ua-location-row">
          <i className="bi bi-geo-alt-fill" />
          <span>{countyCity}</span>
        </div>
      </footer>
    </article>
  );
}
