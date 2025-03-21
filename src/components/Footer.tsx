
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Send, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gelatico-peach-cream">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold font-gelatico text-gelatico-pink mb-4">
                Gelatico
              </h1>
            </Link>
            <p className="text-muted-foreground mb-6">
              Artisanal gelato crafted with passion, bringing a taste of Italy to Kuwait.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/gelatico.kw" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gelatico-pink transition-all duration-300 hover:bg-gelatico-pink hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/gelatico.kw" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gelatico-pink transition-all duration-300 hover:bg-gelatico-pink hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@gelatico.kw" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gelatico-pink transition-all duration-300 hover:bg-gelatico-pink hover:text-white"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide-icon"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                  <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                  <path d="M15 8v8a4 4 0 0 1-4 4"/>
                  <line x1="15" x2="15" y1="6" y2="16"/>
                </svg>
              </a>
              <a 
                href="https://t.snapchat.com/M4lIDwbs" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gelatico-pink transition-all duration-300 hover:bg-gelatico-pink hover:text-white"
                aria-label="Snapchat"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
                Home
              </Link>
              <Link to="/flavors" className="text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
                Our Flavors
              </Link>
              <Link to="/shop" className="text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
                Shop
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
                About Us
              </Link>
              <Link to="/locations" className="text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
                Locations
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-gelatico-pink flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">
                  Boulevard Mall, Salmiya<br />
                  Kuwait
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gelatico-pink flex-shrink-0" />
                <p className="text-muted-foreground">
                  +965 2221 1234
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gelatico-pink flex-shrink-0" />
                <p className="text-muted-foreground">
                  hello@gelatico.kw
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Sign up for our newsletter to receive updates and special offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 pl-4 pr-12 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gelatico-pink"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gelatico-pink text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gelatico-pink/90"
                >
                  <Mail size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="border-gelatico-baby-pink/30 my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Gelatico. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-gelatico-pink transition-colors duration-300">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
