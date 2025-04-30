import { useEffect } from "react";
import PropTypes from "prop-types";
import "./VisitorInfoModal.css";

function VisitorInfoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="visitor-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="visitor-modal-title">
      <div className="visitor-modal-content">
        <button className="visitor-modal-close" aria-label="Close visitor information" onClick={onClose}>×</button>
        <h2 id="visitor-modal-title">Visitor Information</h2>
        <ul>
          <li><strong>Hours:</strong> 10:00 AM – 5:30 PM (Closed Wednesdays)</li>
          <li><strong>Location:</strong> 1000 5th Ave, New York, NY 10028</li>
          <li><strong>Tickets:</strong> Purchase online or at the entrance</li>
          <li><strong>Accessibility:</strong> Wheelchair accessible, assistive listening devices available</li>
          <li><strong>Contact:</strong> (212) 535-7710</li>
        </ul>
        <a href="https://www.metmuseum.org/visit/plan-your-visit" target="_blank" rel="noopener noreferrer" className="modal-link">
          More visitor info
        </a>
      </div>
    </div>
  );
}

VisitorInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VisitorInfoModal;
