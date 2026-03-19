import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useState } from "react";
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
  //     =
  //       =
  //     =

  const showChatButton = isLoggedIn && isOtherPost;
  //     =
  //       =
  //     =
  const images = useMemo(() => {
    if (!petImg) return [];
    
    try {
      const arr = Array.isArray(petImg) ? petImg : [petImg];
      
      return arr
        .filter(img => typeof img === 'string' && img.length > 0)
        .map(img => img.startsWith('/') ? img : `/${img}`);
    } catch (e) {
      console.error("Kép parse hiba:", e);
      return [];
    }
  }, [petImg]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="ua-card">
      <header className="ua-card-header">
        <div className="ua-card-avatar-circle">
          <i className="bi bi-person-fill" />
        </div>
        <span className="ua-card-username">{username}</span>
      </header>

      <div className="ua-card-image ua-carousel">
        
            {hasMultipleImages && (
              <button
                className="ua-carousel-btn ua-carousel-btn-left"
                onClick={goToPrev}
                aria-label="Előző kép"
              >
                <i className="bi bi-chevron-left" />
              </button>
            )}
            <img
              src={images[currentIndex]}
              alt={`${petName}- ${currentIndex + 1}/${images.length}`}
              className="ua-carousel-images"
            />
            {hasMultipleImages && (
              <button
                className="ua-carousel-btn ua-carousel-btn-right"
                onClick={goToNext}
                aria-label="Következő kép"
              >
                <i className="bi bi-chevron-right" />
              </button>
            )}
            {hasMultipleImages && (
              <div className="ua-carousel-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`ua-carousel-dot ${
                      index === currentIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Kép ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}
            {hasMultipleImages && (
              <div className="ua-carousel-counter">
                {currentIndex + 1}/ {images.length}
              </div>
            )}
          
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
