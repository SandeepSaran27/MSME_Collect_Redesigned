import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-final-cta">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="landing-final-cta__title">
          Stop chasing documents. <br /> Start chasing payments.
        </h2>
        <p className="landing-final-cta__sub">
          Bring your invoices, evidence and follow-ups into one AI-assisted workspace
          built for MSMEs.
        </p>
        <div className="landing-final-cta__ctas">
          <button type="button" className="landing-btn-primary" onClick={() => navigate('/register')}>
            Create Account
            <ArrowRight size={17} />
          </button>
          <button type="button" className="landing-btn-ghost" onClick={() => navigate('/login')}>
            <LogIn size={16} />
            Sign In
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
