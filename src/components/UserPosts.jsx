import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";
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
  actionType = "none",
  onDelete,
  chatIcon,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isLoggedIn = !!user;
  const locationText = [county, city, postcode].filter(Boolean).join(", ");

  const isOtherPost = postUserId
    ? Number(user?.user_id) !== Number(postUserId)
    : user?.username !== username;
  //     =
  //       =
  //     =

  const showChatButton = actionType === "message" && isLoggedIn && isOtherPost;
  const showDeleteButton = actionType === "delete";
  //     =
  //       =
  //     =

  const images = useMemo(() => {
    // console.log("petImg kapott érték:", petImg);
    if (!petImg) return [];

    try {
      const arr = Array.isArray(petImg) ? petImg : [petImg];

      return arr
        .filter(
          (img) => img && (typeof img === "string" || typeof img === "object"),
        )
        .map((img) => {
          const url = typeof img === "object" ? img.url : img;
          if (!url) return null;

          return url.startsWith("/") ? url : `/${url}`;
        })
        .filter(Boolean);
    } catch (e) {
      console.error("Kép parse hiba:", e);
      return [];
    }
  }, [petImg]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleConfirmDelete = () => {
    onDelete?.(id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <article className="ua-card" style={{ position: "relative" }}>
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
          {images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt={`${petName}- ${currentIndex + 1}/${images.length}`}
              className="ua-carousel-images"
            />
          ) : (
            <div className="ua-no-image">
              <i className="bi bi-image" />
            </div>
          )}

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
          <div className="ua-pet-name d-flex justify-content-between align-items-center">
            <span>{petName}</span>

            <div className="d-flex align-items-center gap-2">
              {showChatButton && (
                <Link
                  to={`/chat?user=${postUserId}&name=${username}`}
                  className="ua-chat-link"
                  title={`Üzenet küldés neki: ${username}`}
                >
                  {chatIcon}
                </Link>
              )}

              {showDeleteButton && (
                <button
                  type="button"
                  className="btn-action"
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Poszt törlése"
                >
                  <i className="bi bi-trash" />
                </button>
              )}
            </div>
          </div>

          <div className="ua-note-label">Megjegyzés:</div>
          <div className="ua-note-box">{note}</div>

          <div className="ua-location-row">
            <i className="bi bi-geo-alt-fill" />
            <span>{locationText}</span>
          </div>
        </footer>
        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Poszt törlése"
            message={`Biztosan törölni szeretnéd ezt a posztot: ${petName}?`}
            confirmText="Törlés"
            cancelText="Mégse"
            icon={<i className="bi bi-trash" />}
            inline={true}
          />
        )}
      </article>
    </>
  );
}
