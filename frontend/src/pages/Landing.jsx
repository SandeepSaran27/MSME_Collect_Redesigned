import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import StickyProcessSection from '../components/landing/StickyProcessSection';
import ImpactSection from '../components/landing/ImpactSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="landing">
      <LandingNavbar />
      <Hero />
      <Features />
      <StickyProcessSection />
      <ImpactSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
};

export default Landing;
