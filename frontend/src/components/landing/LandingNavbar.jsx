import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'impact', label: 'Impact' },
  { id: 'about', label: 'About' },
];

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="landing-navbar-wrap">
      <nav className={`landing-navbar ${scrolled ? 'landing-navbar--scrolled' : ''}`}>
        <div className="landing-navbar__logo" onClick={() => handleNavClick('home')}>
          <span className="landing-navbar__logo-mark">
            <ShieldCheck size={16} color="#fff" />
          </span>
          MSME Collect
        </div>

        <div className="landing-navbar__links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`landing-navbar__link ${active === item.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', boxShadow: 'none' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="landing-navbar__actions">
          <button
            type="button"
            className="landing-navbar__login"
            onClick={() => navigate('/login')}
            style={{ boxShadow: 'none' }}
          >
            Login
          </button>
          <button
            type="button"
            className="landing-navbar__register"
            onClick={() => navigate('/register')}
            style={{ boxShadow: 'none' }}
          >
            Register
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingNavbar;
