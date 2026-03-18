import { Link } from "react-router-dom";
export default function UserPosts({
  id,
  user,
  username,
  postUserId,
  petImg,
  petName,
  note,
  county,
  city,
  postcode,
  send_a_message,
}) {
  const isLoggedIn = !!user;
  const locationText = [county, city, postcode].filter(Boolean).join(", ");
  const isOtherPost = postUserId
    ? Number(user?.user_id) !== Number(postUserId)
    : user?.username !== username;

  const showChatButton = isLoggedIn && isOtherPost;
  // =
  //   =
  //     =
  //       =
  //     =
  //   =
  // =
  return (
    <article className="ua-card">
      <header className="ua-card-header">
        <div className="ua-card-avatar-circle">
          <i className="bi bi-person-fill" />
        </div>
        <span className="ua-card-username">{username}</span>
      </header>

      <div className="ua-card-image">
        <img src={petImg} alt={petName} />
      </div>

      <footer className="ua-card-footer">
        <div className="ua-pet-name d-flex justify-content-between">
          {petName}
          {showChatButton && (
            <Link
              to={`/chat?user=${postUserId}&name=${username}`}
              className="ua-chat-link"
              title={`Üzenet küldés neki: ${username}`}
            >
              {send_a_message}
            </Link>
          )}
        </div>

        <div className="ua-note-label">Megjegyzés:</div>
        <div className="ua-note-box">{note}</div>

        <div className="ua-location-row">
          <i className="bi bi-geo-alt-fill" />
          <span>{locationText}</span>
        </div>
      </footer>
    </article>
  );
}
