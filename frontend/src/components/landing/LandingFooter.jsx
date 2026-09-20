import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer" id="about">
      <div className="landing-container">
        <div className="landing-footer__top">
          <div className="landing-footer__brand">
            <div className="landing-footer__brand-name">
              <ShieldCheck size={19} color="#a5b4ff" />
              MSME Collect
            </div>
            <p>
              MSME Collect is an AI-powered evidence-readiness and payment
              follow-up platform for small and medium businesses. It helps you
              organize invoices, purchase orders, delivery proofs and
              correspondence, verify evidence, track payment status and follow
              up before delays become collection problems.
            </p>
          </div>

          <div className="landing-footer__cols">
            <div className="landing-footer__col">
              <h5>Product</h5>
              <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</span>
              <span onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How It Works</span>
              <span onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>Impact</span>
            </div>
            <div className="landing-footer__col">
              <h5>Account</h5>
              <a onClick={() => navigate('/login')}>Login</a>
              <a onClick={() => navigate('/register')}>Register</a>
            </div>
            <div className="landing-footer__col">
              <h5>Workspace</h5>
              <span>Documents</span>
              <span>Evidence</span>
              <span>Escalations</span>
            </div>
          </div>
        </div>

        <div className="landing-footer__bottom">
          <span>© {new Date().getFullYear()} MSME Collect. All rights reserved.</span>
          <span>Evidence-ready. Payment-ready.</span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
