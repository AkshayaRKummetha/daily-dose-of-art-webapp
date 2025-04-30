import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social media">
      <a href="https://facebook.com/metmuseum" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FaFacebook />
      </a>
      <a href="https://twitter.com/metmuseum" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <FaTwitter />
      </a>
      <a href="https://instagram.com/metmuseum" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FaInstagram />
      </a>
    </nav>
  );
}
