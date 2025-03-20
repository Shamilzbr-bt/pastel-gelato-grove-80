
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Our Flavors', path: '/flavors' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Locations', path: '/locations' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300", 
        isScrolled ? "py-2 bg-white/80 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="relative z-10 transition-all duration-300 hover:opacity-80"
        >
          <h1 className="text-2xl md:text-3xl font-bold font-gelatico text-gelatico-pink">
            Gelatico
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-gelatico-pink after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:text-gelatico-pink hover:after:scale-x-100",
                isActive(item.path) 
                  ? "text-gelatico-pink after:scale-x-100" 
                  : "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}

          <Link 
            to="/cart" 
            className="relative p-2 text-foreground transition-all duration-300 hover:text-gelatico-pink"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-gelatico-pink rounded-full">
              0
            </span>
          </Link>
        </nav>

        {/* Mobile: Menu Button & Cart */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link 
            to="/cart" 
            className="relative p-1 text-foreground transition-all duration-300 hover:text-gelatico-pink"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-gelatico-pink rounded-full">
              0
            </span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-foreground transition-all duration-300 hover:text-gelatico-pink"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 md:hidden",
            isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-xl font-medium transition-all duration-300",
                isActive(item.path) ? "text-gelatico-pink" : "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
