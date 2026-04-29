export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Megerősít",
  cancelText = "Mégse",
  icon,
  children,
  inline = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={inline ? "modal-overlay-inline" : "modal-overlay"}
      onClick={onClose}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">{icon}</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        {children}
        <div className="modal-buttons">
          <button className="modal-btn modal-btn-delete" onClick={onClose}>
            {cancelText}
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
