import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LANDING_CSS = `
  .sta-landing *, .sta-landing *::before, .sta-landing *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sta-landing { font-family: 'Outfit', sans-serif; color: #e0e0e0; background: #0a0a0a; overflow-x: hidden; }
  .sta-landing a { text-decoration: none; color: inherit; }
  .sta-landing img { max-width: 100%; display: block; }

  .sta-landing {
    --black-900: #050505;
    --black-800: #0a0a0a;
    --black-700: #111111;
    --black-600: #1a1a1a;
    --black-500: #222222;
    --black-400: #2a2a2a;
    --black-200: #3a3a3a;
    --black-100: #444444;
    --black-50:  #0d0d0d;
    --gold:       #D4AF37;
    --gold-dark:  #B8962E;
    --gold-light: #F0D060;
    --gold-muted: #A8882A;
    --amber:      #E6A817;
    --white:      #FFFFFF;
    --text-primary: #f0f0f0;
    --text-secondary: #b0b0b0;
    --glass-bg:   rgba(20, 20, 20, 0.75);
    --glass-border: rgba(212, 175, 55, 0.15);
    --shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-md:  0 8px 32px rgba(0, 0, 0, 0.4);
    --shadow-lg:  0 16px 48px rgba(0, 0, 0, 0.5);
    --radius:     16px;
    --transition: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Navigation */
  .sta-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: background var(--transition), box-shadow var(--transition), padding var(--transition);
  }
  .sta-nav.scrolled {
    background: rgba(10, 10, 10, 0.92);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 rgba(212, 175, 55, 0.1);
    padding: 0.6rem 2rem;
  }
  .sta-nav-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'Lora', serif; font-weight: 700; font-size: 1.25rem;
    color: var(--white); transition: color var(--transition); cursor: pointer;
  }
  .sta-nav-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; line-height: 1;
  }
  .sta-nav-links { display: flex; align-items: center; gap: 2rem; }
  .sta-nav-links a {
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.02em;
    color: rgba(255,255,255,0.8); transition: color var(--transition);
  }
  .sta-nav.scrolled .sta-nav-links a { color: var(--text-secondary); }
  .sta-nav-links a:hover { color: var(--gold); }
  .sta-nav-cta {
    padding: 0.5rem 1.25rem; border-radius: 50px;
    background: var(--glass-bg); backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    font-size: 0.8rem; font-weight: 600; color: var(--white) !important;
    transition: all var(--transition); cursor: pointer;
  }
  .sta-nav.scrolled .sta-nav-cta {
    background: var(--gold); border-color: var(--gold);
    color: var(--black-900) !important;
  }
  .sta-nav-cta:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }

  .sta-nav-toggle { display: none; cursor: pointer; flex-direction: column; gap: 5px; background: none; border: none; padding: 0; }
  .sta-nav-toggle span { display: block; width: 24px; height: 2px; background: var(--white); border-radius: 2px; transition: all var(--transition); }

  /* Hero */
  .sta-hero {
    min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 8rem 2rem 6rem;
    background: linear-gradient(170deg, #000000 0%, #0a0a0a 35%, #111111 60%, #151515 100%);
    position: relative; overflow: hidden;
  }
  .sta-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212, 175, 55, 0.06), transparent);
  }
  .sta-hero::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 120px;
    background: linear-gradient(to top, var(--black-50), transparent);
  }

  .sta-orb {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3;
    animation: sta-float 20s ease-in-out infinite;
  }
  .sta-orb-1 { width: 400px; height: 400px; background: var(--gold-dark); top: 10%; left: -5%; animation-delay: 0s; opacity: 0.15; }
  .sta-orb-2 { width: 300px; height: 300px; background: var(--gold); top: 60%; right: -5%; animation-delay: -7s; opacity: 0.12; }
  .sta-orb-3 { width: 250px; height: 250px; background: var(--gold-muted); top: 30%; right: 20%; animation-delay: -14s; opacity: 0.1; }
  @keyframes sta-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.95); }
  }

  .sta-hero-content { position: relative; z-index: 2; max-width: 800px; }
  .sta-hero-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.35rem 1rem; border-radius: 50px;
    background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 2rem;
  }
  .sta-hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); animation: sta-pulse 2s ease-in-out infinite;
  }
  @keyframes sta-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .sta-hero h1 {
    font-family: 'Lora', serif; font-weight: 600; font-size: 3.5rem;
    line-height: 1.15; color: var(--white); margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }
  .sta-hero h1 em { font-style: italic; color: var(--gold-light); }
  .sta-hero p {
    font-size: 1.1rem; line-height: 1.7; color: rgba(255,255,255,0.75);
    max-width: 620px; margin: 0 auto 2.5rem; font-weight: 300;
  }
  .sta-hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .sta-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.85rem 2rem; border-radius: 50px;
    font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600;
    transition: all var(--transition); cursor: pointer; border: none;
  }
  .sta-btn-primary {
    background: var(--gold); color: var(--black-900);
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
  }
  .sta-btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .sta-btn-ghost {
    background: rgba(255,255,255,0.1); color: var(--white);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(8px);
  }
  .sta-btn-ghost:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }
  .sta-btn-arrow { font-size: 1.1rem; transition: transform var(--transition); }
  .sta-btn:hover .sta-btn-arrow { transform: translateX(3px); }

  /* Sections shared */
  .sta-landing section { padding: 6rem 2rem; }
  .sta-section-inner { max-width: 1100px; margin: 0 auto; }
  .sta-section-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.75rem;
  }
  .sta-section-title {
    font-family: 'Lora', serif; font-weight: 600; font-size: 2.4rem;
    line-height: 1.2; color: var(--text-primary); margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  .sta-section-desc {
    font-size: 1rem; line-height: 1.7; color: var(--text-secondary); opacity: 0.8;
    max-width: 560px; font-weight: 300;
  }

  /* Trust Bar */
  .sta-trust {
    background: var(--black-700); text-align: center;
    padding: 3.5rem 2rem;
    border-top: 1px solid rgba(212, 175, 55, 0.1);
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  }
  .sta-trust-inner {
    max-width: 1000px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center; gap: 3.5rem; flex-wrap: wrap;
  }
  .sta-trust-item { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  .sta-trust-num { font-family: 'Lora', serif; font-weight: 700; font-size: 2rem; color: var(--gold); }
  .sta-trust-label { font-size: 0.72rem; font-weight: 500; color: var(--text-secondary); opacity: 0.6; letter-spacing: 0.04em; }

  /* Cards Grid */
  .sta-cards { padding: 4rem 2rem 6rem; }
  .sta-cards-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
  }
  .sta-card {
    position: relative; border-radius: var(--radius); padding: 2.5rem 2rem;
    background: var(--glass-bg);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition);
    display: flex; flex-direction: column;
  }
  .sta-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--gold-dark); }
  .sta-card-icon {
    width: 56px; height: 56px; border-radius: 14px; margin-bottom: 1.5rem;
    display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
  }
  .sta-card-icon.trade { background: linear-gradient(135deg, var(--gold-dark), var(--gold)); }
  .sta-card-icon.payment { background: linear-gradient(135deg, #8B7424, var(--gold-light)); }
  .sta-card-icon.ledger { background: linear-gradient(135deg, #5C4A12, var(--gold-muted)); }
  .sta-card-icon.blockchain { background: linear-gradient(135deg, #3D3209, #8B7424); }
  .sta-card-icon.supply { background: linear-gradient(135deg, var(--gold-muted), var(--gold)); }
  .sta-card-icon.fx { background: linear-gradient(135deg, #6B5A1E, var(--gold-dark)); }
  .sta-card h3 {
    font-family: 'Lora', serif; font-weight: 600; font-size: 1.3rem;
    color: var(--text-primary); margin-bottom: 0.75rem;
  }
  .sta-card p {
    font-size: 0.86rem; line-height: 1.7; color: var(--text-secondary); opacity: 0.8;
    font-weight: 300; flex: 1; margin-bottom: 1.5rem;
  }
  .sta-card-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; font-weight: 600; color: var(--gold);
    transition: all var(--transition);
  }
  .sta-card-link:hover { color: var(--gold-light); gap: 0.6rem; }
  .sta-card-tag {
    position: absolute; top: 1.25rem; right: 1.25rem;
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.2rem 0.6rem; border-radius: 50px;
    background: rgba(212, 175, 55, 0.1); color: var(--gold);
  }

  /* Platform Section */
  .sta-platform-section { background: var(--black-800); }
  .sta-platform-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-top: 3rem;
  }
  .sta-platform-features { display: flex; flex-direction: column; gap: 1.5rem; }
  .sta-feature { display: flex; gap: 1rem; align-items: flex-start; }
  .sta-feature-icon {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px;
    background: rgba(212, 175, 55, 0.1);
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  }
  .sta-feature h4 { font-weight: 600; font-size: 0.92rem; color: var(--text-primary); margin-bottom: 0.2rem; }
  .sta-feature p { font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); opacity: 0.7; font-weight: 300; }
  .sta-platform-visual {
    background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
    border-radius: var(--radius); padding: 2.5rem;
    border: 1px solid rgba(212, 175, 55, 0.15);
    box-shadow: var(--shadow-lg); position: relative; overflow: hidden;
  }
  .sta-platform-visual::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.08), transparent);
  }
  .sta-platform-visual-header {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; position: relative; z-index: 1;
  }
  .sta-platform-visual-dot { width: 8px; height: 8px; border-radius: 50%; }
  .sta-platform-visual-label {
    font-size: 0.7rem; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; margin-left: 0.5rem;
  }
  .sta-pipeline-step {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 1rem; margin-bottom: 0.5rem;
    border-radius: 8px; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    transition: all var(--transition);
  }
  .sta-pipeline-step:hover { background: rgba(255,255,255,0.1); }
  .sta-pipeline-num { font-family: 'Outfit', sans-serif; font-size: 0.65rem; font-weight: 700; color: var(--gold); width: 20px; text-align: center; }
  .sta-pipeline-text { font-size: 0.78rem; color: rgba(255,255,255,0.8); font-weight: 400; }
  .sta-pipeline-tag {
    margin-left: auto; font-size: 0.6rem; font-weight: 500;
    padding: 0.15rem 0.5rem; border-radius: 50px;
    background: rgba(201, 168, 76, 0.15); color: var(--gold);
  }

  /* Benefits Section */
  .sta-benefits-section {
    background: linear-gradient(170deg, #050505 0%, #111111 100%); color: var(--white);
  }
  .sta-benefits-section .sta-section-label { color: var(--gold); }
  .sta-benefits-section .sta-section-title { color: var(--white); }
  .sta-benefits-section .sta-section-desc { color: rgba(255,255,255,0.7); }
  .sta-benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
  .sta-benefit-card {
    padding: 2rem 1.5rem; border-radius: var(--radius);
    background: rgba(212, 175, 55, 0.04);
    border: 1px solid rgba(212, 175, 55, 0.1);
    backdrop-filter: blur(12px);
    transition: all var(--transition);
  }
  .sta-benefit-card:hover { background: rgba(212, 175, 55, 0.08); transform: translateY(-4px); border-color: rgba(212, 175, 55, 0.25); }
  .sta-benefit-icon { font-size: 2rem; margin-bottom: 1rem; }
  .sta-benefit-card h4 { font-family: 'Lora', serif; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.6rem; }
  .sta-benefit-card p { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.65); font-weight: 300; }

  /* Future Section */
  .sta-future-section { background: var(--black-800); }
  .sta-future-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 3rem; }
  .sta-future-card {
    padding: 2rem 1.5rem; border-radius: var(--radius);
    background: var(--black-600);
    border: 1px solid rgba(212, 175, 55, 0.1);
    transition: all var(--transition);
  }
  .sta-future-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: rgba(212, 175, 55, 0.25); }
  .sta-future-card h4 {
    font-family: 'Lora', serif; font-weight: 600; font-size: 1.05rem;
    color: var(--text-primary); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .sta-future-card p { font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); opacity: 0.7; font-weight: 300; }

  /* CTA Section */
  .sta-cta-section {
    background: var(--black-700); text-align: center; padding: 6rem 2rem;
    border-top: 1px solid rgba(212, 175, 55, 0.08);
  }
  .sta-cta-inner { max-width: 700px; margin: 0 auto; }
  .sta-cta-section .sta-section-title { margin-bottom: 1rem; }
  .sta-cta-desc {
    font-size: 1rem; line-height: 1.7; color: var(--text-secondary); opacity: 0.8;
    font-weight: 300; margin-bottom: 2.5rem;
  }
  .sta-btn-cta-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 1rem 2.5rem; border-radius: 50px;
    background: var(--gold); color: var(--black-900);
    font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600;
    border: none; cursor: pointer;
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
    transition: all var(--transition);
  }
  .sta-btn-cta-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4); }

  /* Footer */
  .sta-footer {
    background: #050505; color: rgba(255,255,255,0.5);
    padding: 3rem 2rem; text-align: center;
    border-top: 1px solid rgba(212, 175, 55, 0.1);
  }
  .sta-footer-inner { max-width: 1100px; margin: 0 auto; }
  .sta-footer-brand { font-family: 'Lora', serif; font-weight: 700; font-size: 1.1rem; color: var(--white); margin-bottom: 0.75rem; }
  .sta-footer p { font-size: 0.75rem; line-height: 1.8; }
  .sta-footer-links { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; }
  .sta-footer-links a { font-size: 0.72rem; font-weight: 500; color: rgba(255,255,255,0.4); transition: color var(--transition); }
  .sta-footer-links a:hover { color: var(--gold); }
  .sta-footer-afcfta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    margin-top: 1.5rem; padding: 0.4rem 1rem; border-radius: 50px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.68rem; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 0.05em;
  }

  /* Scroll Reveal */
  .sta-reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .sta-reveal.visible { opacity: 1; transform: translateY(0); }
  .sta-reveal-delay-1 { transition-delay: 0.1s; }
  .sta-reveal-delay-2 { transition-delay: 0.2s; }
  .sta-reveal-delay-3 { transition-delay: 0.3s; }
  .sta-reveal-delay-4 { transition-delay: 0.4s; }
  .sta-reveal-delay-5 { transition-delay: 0.5s; }

  /* Responsive */
  @media (max-width: 991px) {
    .sta-hero h1 { font-size: 2.6rem; }
    .sta-cards-inner { grid-template-columns: 1fr; max-width: 500px; }
    .sta-platform-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .sta-benefits-grid { grid-template-columns: 1fr; max-width: 500px; margin-left: auto; margin-right: auto; }
    .sta-future-grid { grid-template-columns: 1fr; }
    .sta-trust-inner { gap: 2rem; }
  }
  @media (max-width: 768px) {
    .sta-nav-links { display: none; }
    .sta-nav-toggle { display: flex; }
    .sta-nav-links.open {
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: #050505; z-index: 200;
      align-items: center; justify-content: center; gap: 2rem;
    }
    .sta-nav-links.open a { color: var(--white); font-size: 1.1rem; }
    .sta-nav-close {
      position: absolute; top: 1.5rem; right: 1.5rem;
      font-size: 1.5rem; color: var(--white); cursor: pointer;
      background: none; border: none;
    }
    .sta-hero h1 { font-size: 2.2rem; }
    .sta-hero-actions { flex-direction: column; align-items: center; }
    .sta-section-title { font-size: 1.8rem; }
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject scoped styles
    const style = document.createElement('style');
    style.textContent = LANDING_CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    // Scroll-triggered nav style
    const handleScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll reveal
    const reveals = containerRef.current?.querySelectorAll('.sta-reveal');
    if (!reveals) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openMobileNav = () => navLinksRef.current?.classList.add('open');
  const closeMobileNav = () => navLinksRef.current?.classList.remove('open');

  const scrollTo = (id: string) => {
    closeMobileNav();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sta-landing" ref={containerRef}>
      {/* Navigation */}
      <nav className="sta-nav" ref={navRef}>
        <span className="sta-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="sta-nav-logo-icon">&#127757;</span>
          Smart Trade Africa
        </span>
        <div className="sta-nav-links" ref={navLinksRef}>
          <button className="sta-nav-close" onClick={closeMobileNav} aria-label="Close menu">&times;</button>
          <a href="#platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Platform</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('sta-features'); }}>Features</a>
          <a href="#benefits" onClick={(e) => { e.preventDefault(); scrollTo('sta-benefits'); }}>Benefits</a>
          <a href="#future" onClick={(e) => { e.preventDefault(); scrollTo('sta-future'); }}>Stable Coins &amp; Future</a>
          <a className="sta-nav-cta" onClick={() => navigate('/login')} role="button" tabIndex={0}>Get Started</a>
        </div>
        <button className="sta-nav-toggle" onClick={openMobileNav} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="sta-hero">
        <div className="sta-orb sta-orb-1" />
        <div className="sta-orb sta-orb-2" />
        <div className="sta-orb sta-orb-3" />
        <div className="sta-hero-content">
          <div className="sta-hero-badge">
            <span className="sta-hero-badge-dot" />
            Powering the AfCFTA agenda
          </div>
          <h1>Digital trade across Africa,<br /><em>securely automated.</em></h1>
          <p>A cutting-edge platform that streamlines trade taxes, processes secure payments, and manages automated ledgers &mdash; creating a digital twin of Africa's trade system.</p>
          <div className="sta-hero-actions">
            <a className="sta-btn sta-btn-primary" onClick={() => navigate('/login')} role="button" tabIndex={0}>
              Get Started <span className="sta-btn-arrow">&rarr;</span>
            </a>
            <a className="sta-btn sta-btn-ghost" onClick={() => navigate('/explore')} role="button" tabIndex={0}>
              Explore the Platform
            </a>
          </div>
        </div>
      </section>

      {/* Trust Numbers */}
      <div className="sta-trust">
        <div className="sta-trust-inner">
          <div className="sta-trust-item sta-reveal">
            <span className="sta-trust-num">3s</span>
            <span className="sta-trust-label">Cross-FX settlement</span>
          </div>
          <div className="sta-trust-item sta-reveal sta-reveal-delay-1">
            <span className="sta-trust-num">$551M</span>
            <span className="sta-trust-label">Potential savings</span>
          </div>
          <div className="sta-trust-item sta-reveal sta-reveal-delay-2">
            <span className="sta-trust-num">$2.27B</span>
            <span className="sta-trust-label">Missed tax potential</span>
          </div>
          <div className="sta-trust-item sta-reveal sta-reveal-delay-3">
            <span className="sta-trust-num">7M+</span>
            <span className="sta-trust-label">Traders served</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="sta-cards" id="sta-features">
        <div className="sta-cards-inner">
          <div className="sta-card sta-reveal">
            <span className="sta-card-tag">Taxes</span>
            <div className="sta-card-icon trade">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Real-time Tax Collection</h3>
            <p>Capture tax information from trade documents, calculate obligations, and initiate payment &mdash; all in real time with automated ledger entries for customs, income tax, excise, and VAT.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
          <div className="sta-card sta-reveal sta-reveal-delay-1">
            <span className="sta-card-tag">Payments</span>
            <div className="sta-card-icon payment">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3>Secure Payment Integration</h3>
            <p>Seamless collaboration with financial institutions and payment gateways enables secure fund transfers. Settle trade taxes effortlessly with entries automatically reflected in ledgers.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
          <div className="sta-card sta-reveal sta-reveal-delay-2">
            <span className="sta-card-tag">Ledgers</span>
            <div className="sta-card-icon ledger">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <h3>Automated Ledger Management</h3>
            <p>Every tax payment, trade activity, and transaction is automatically logged in real-time. Accurate, up-to-date financial records with a complete audit trail for regulatory compliance.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
          <div className="sta-card sta-reveal">
            <span className="sta-card-tag">Settlement</span>
            <div className="sta-card-icon fx">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3>Cross-FX Settlement</h3>
            <p>Atomically settle payments in 3 seconds across African currencies without resorting to a third currency like the Dollar. Direct African-to-African currency exchange.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
          <div className="sta-card sta-reveal sta-reveal-delay-1">
            <span className="sta-card-tag">Security</span>
            <div className="sta-card-icon blockchain">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <h3>Blockchain-Secured Transactions</h3>
            <p>State-of-the-art encryption and blockchain technology ensure confidentiality, integrity, and availability of all trade data. Prevent fraud and enhance trust among participants.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
          <div className="sta-card sta-reveal sta-reveal-delay-2">
            <span className="sta-card-tag">Supply Chain</span>
            <div className="sta-card-icon supply">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </div>
            <h3>End-to-End Supply Chain Visibility</h3>
            <p>Full visibility of the entire trade supply chain from origin to destination. IoT-enabled tracking, monitoring, and management of goods during import and export processes.</p>
            <a className="sta-card-link" href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Learn more <span className="sta-btn-arrow">&rarr;</span></a>
          </div>
        </div>
      </div>

      {/* Platform Detail Section */}
      <section className="sta-platform-section" id="sta-platform">
        <div className="sta-section-inner">
          <span className="sta-section-label sta-reveal">The STA Platform</span>
          <h2 className="sta-section-title sta-reveal">A digital twin of<br />Africa&apos;s trade system</h2>
          <p className="sta-section-desc sta-reveal">Harnessing blockchain and IoT technologies to create a complete digital replica of the trade ecosystem &mdash; mandated by the Government of Kenya.</p>
          <div className="sta-platform-grid">
            <div className="sta-platform-features">
              <div className="sta-feature sta-reveal">
                <div className="sta-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h4>Government-owned data</h4>
                  <p>All data is owned by the Kenyan Government, ensuring national sovereignty over trade intelligence and economic analytics.</p>
                </div>
              </div>
              <div className="sta-feature sta-reveal sta-reveal-delay-1">
                <div className="sta-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div>
                  <h4>Real-time data analytics</h4>
                  <p>Advanced data analytics provide actionable insights for data-driven decision-making across government-owned trade data in real time.</p>
                </div>
              </div>
              <div className="sta-feature sta-reveal sta-reveal-delay-2">
                <div className="sta-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </div>
                <div>
                  <h4>Trade process automation</h4>
                  <p>Eliminate manual trade processes &mdash; reduce paperwork, human error, and processing time for increased efficiency and productivity.</p>
                </div>
              </div>
              <div className="sta-feature sta-reveal sta-reveal-delay-3">
                <div className="sta-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <h4>Compliance &amp; risk management</h4>
                  <p>Ensure compliance with trade regulations and manage risks associated with international trade, minimizing penalties and disruptions.</p>
                </div>
              </div>
            </div>
            <div className="sta-platform-visual sta-reveal">
              <div className="sta-platform-visual-header">
                <span className="sta-platform-visual-dot" style={{ background: '#FF6B6B' }} />
                <span className="sta-platform-visual-dot" style={{ background: '#FFD93D' }} />
                <span className="sta-platform-visual-dot" style={{ background: '#6BCB77' }} />
                <span className="sta-platform-visual-label">Trade Pipeline</span>
              </div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">01</span><span className="sta-pipeline-text">Trade document capture &amp; validation</span><span className="sta-pipeline-tag">Intake</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">02</span><span className="sta-pipeline-text">Automated tax calculation</span><span className="sta-pipeline-tag">Tax</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">03</span><span className="sta-pipeline-text">Secure payment processing</span><span className="sta-pipeline-tag">Payment</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">04</span><span className="sta-pipeline-text">Cross-FX currency settlement</span><span className="sta-pipeline-tag">FX</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">05</span><span className="sta-pipeline-text">Automated ledger entries</span><span className="sta-pipeline-tag">Ledger</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">06</span><span className="sta-pipeline-text">Supply chain tracking &amp; IoT</span><span className="sta-pipeline-tag">Track</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">07</span><span className="sta-pipeline-text">Compliance &amp; audit reporting</span><span className="sta-pipeline-tag">Audit</span></div>
              <div className="sta-pipeline-step"><span className="sta-pipeline-num">08</span><span className="sta-pipeline-text">Government analytics dashboard</span><span className="sta-pipeline-tag">Output</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="sta-benefits-section" id="sta-benefits">
        <div className="sta-section-inner">
          <span className="sta-section-label sta-reveal">Why Smart Trade Africa</span>
          <h2 className="sta-section-title sta-reveal">Transformative benefits<br />for the entire ecosystem</h2>
          <p className="sta-section-desc sta-reveal">From government tax revenue to merchant livelihoods, STA creates value at every level of the trade supply chain.</p>
          <div className="sta-benefits-grid">
            <div className="sta-benefit-card sta-reveal">
              <div className="sta-benefit-icon">&#128200;</div>
              <h4>Increased Tax Revenue</h4>
              <p>Digital ledgering of all records and transactions ensures increased revenue in customs, income tax, excise taxes, and VAT collection.</p>
            </div>
            <div className="sta-benefit-card sta-reveal sta-reveal-delay-1">
              <div className="sta-benefit-icon">&#127758;</div>
              <h4>GDP &amp; Employment Growth</h4>
              <p>Provide merchants across Kenya and Africa a larger market to sell products, increasing GDP and driving economic participation.</p>
            </div>
            <div className="sta-benefit-card sta-reveal sta-reveal-delay-2">
              <div className="sta-benefit-icon">&#9889;</div>
              <h4>Enhanced Efficiency</h4>
              <p>Automate tax calculations, payment processing, and ledger management &mdash; saving time and resources for core trade activities.</p>
            </div>
            <div className="sta-benefit-card sta-reveal sta-reveal-delay-3">
              <div className="sta-benefit-icon">&#128176;</div>
              <h4>Cost Savings</h4>
              <p>Eliminate extensive manual record-keeping, reduce errors, and minimize costs associated with tax compliance and ledger management.</p>
            </div>
            <div className="sta-benefit-card sta-reveal sta-reveal-delay-4">
              <div className="sta-benefit-icon">&#127919;</div>
              <h4>Improved Accuracy</h4>
              <p>Automated tax calculation and ledger management ensures precise, reliable financial records with minimal human errors.</p>
            </div>
            <div className="sta-benefit-card sta-reveal sta-reveal-delay-5">
              <div className="sta-benefit-icon">&#128270;</div>
              <h4>Streamlined Audits</h4>
              <p>Comprehensive automated ledgers simplify audit processes with easily retrievable transaction details and a complete audit trail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stable Coins Future Section */}
      <section className="sta-future-section" id="sta-future">
        <div className="sta-section-inner">
          <span className="sta-section-label sta-reveal">The Future</span>
          <h2 className="sta-section-title sta-reveal">Stable Coins-powered<br />trade finance</h2>
          <p className="sta-section-desc sta-reveal">Smart Trade Africa is built to integrate Stable Coins, unlocking new financial models for the African trade ecosystem.</p>
          <div className="sta-future-grid">
            <div className="sta-future-card sta-reveal">
              <h4><span>&#128260;</span> Dynamic Discounting</h4>
              <p>Buyers offer early payment discounts to suppliers via Stable Coins for prompt settlement, optimizing cash flow and reducing financing costs.</p>
            </div>
            <div className="sta-future-card sta-reveal sta-reveal-delay-1">
              <h4><span>&#127970;</span> Reverse Factoring</h4>
              <p>Buyers arrange Stable Coins-based financing for suppliers, leveraging stronger credit ratings for favourable terms and efficient fund disbursement.</p>
            </div>
            <div className="sta-future-card sta-reveal sta-reveal-delay-2">
              <h4><span>&#128196;</span> Invoice Financing</h4>
              <p>Tokenize invoices on blockchain as collateral for short-term financing, providing transparency and reducing administrative overhead.</p>
            </div>
            <div className="sta-future-card sta-reveal sta-reveal-delay-3">
              <h4><span>&#128230;</span> Supply Chain Tokenization</h4>
              <p>Represent supply chain assets as digital tokens for trading and collateral, fostering liquidity and creating new investment opportunities.</p>
            </div>
            <div className="sta-future-card sta-reveal sta-reveal-delay-4">
              <h4><span>&#127942;</span> Performance-based Financing</h4>
              <p>Smart contracts automate payment releases based on predefined milestones, incentivizing suppliers to meet quality benchmarks.</p>
            </div>
            <div className="sta-future-card sta-reveal sta-reveal-delay-5">
              <h4><span>&#129309;</span> Peer-to-Peer Lending</h4>
              <p>Suppliers access financing directly from investors within the network, bypassing traditional intermediaries with seamless Stable Coins settlement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="sta-cta-section" id="sta-contact">
        <div className="sta-cta-inner">
          <span className="sta-section-label sta-reveal">Get Involved</span>
          <h2 className="sta-section-title sta-reveal">Join the consortium<br />transforming African trade</h2>
          <p className="sta-cta-desc sta-reveal">STA encourages a consortium approach &mdash; fostering collaboration between governments, businesses, and technology providers to accelerate digital transformation of trade across the continent.</p>
          <a className="sta-btn-cta-primary sta-reveal sta-reveal-delay-1" onClick={() => navigate('/login')} role="button" tabIndex={0}>
            Get Started <span className="sta-btn-arrow">&rarr;</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="sta-footer">
        <div className="sta-footer-inner">
          <div className="sta-footer-brand">Smart Trade Africa</div>
          <p>A disruptive digital trade platform originating from Kenya. Streamlining trade taxes, secure payments, and automated ledgers across the continent.</p>
          <p style={{ marginTop: '0.5rem' }}>Nairobi, Kenya &middot; smarttradeafrica.com</p>
          <div className="sta-footer-links">
            <a href="#sta-platform" onClick={(e) => { e.preventDefault(); scrollTo('sta-platform'); }}>Platform</a>
            <a href="#sta-features" onClick={(e) => { e.preventDefault(); scrollTo('sta-features'); }}>Features</a>
            <a href="#sta-benefits" onClick={(e) => { e.preventDefault(); scrollTo('sta-benefits'); }}>Benefits</a>
            <a href="#sta-future" onClick={(e) => { e.preventDefault(); scrollTo('sta-future'); }}>Stable Coins &amp; Future</a>
          </div>
          <div className="sta-footer-afcfta">
            &#127757; Aligned with the African Continental Free Trade Area (AfCFTA)
          </div>
        </div>
      </footer>
    </div>
  );
}
