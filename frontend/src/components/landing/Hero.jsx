import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, PlayCircle, FileText, Receipt, Truck,
  BadgeCheck, Sparkles, Wallet,
} from 'lucide-react';

const FLOATERS = [
  { label: 'Purchase Order', icon: FileText, top: '4%', left: '-8%', delay: 0 },
  { label: 'Delivery Proof', icon: Truck, top: '18%', left: '78%', delay: 0.6 },
  { label: 'Invoice', icon: Receipt, top: '58%', left: '-12%', delay: 1.2 },
  { label: 'Evidence Ready', icon: BadgeCheck, top: '78%', left: '72%', delay: 1.8 },
  { label: 'AI Analysis', icon: Sparkles, top: '2%', left: '54%', delay: 2.4 },
  { label: 'Payment', icon: Wallet, top: '92%', left: '30%', delay: 3 },
];

const PARTICLE_COUNT = 14;

const Hero = () => {
  const navigate = useNavigate();

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 137.5) % 100}%`,
        top: `${(i * 71) % 100}%`,
        size: 2 + (i % 3),
        duration: 14 + (i % 6) * 3,
        delay: -(i * 2.3),
      })),
    []
  );

  return (
    <section className="landing-hero" id="home">
      <div className="landing-hero__bg" aria-hidden="true" />
      <div className="landing-hero__grid" aria-hidden="true" />

      <div aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="landing-hero__particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="landing-container landing-hero__inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="landing-hero__eyebrow">
            <span className="dot" />
            AI-POWERED PAYMENT FOLLOW-UP FOR MSMEs
          </div>

          <h1 className="landing-hero__headline">
            Turn Your Invoices <br />
            Into <span className="landing-hero__gradient-text">Real Payments</span>
          </h1>

          <p className="landing-hero__sub">
            MSME Collect organizes your invoices, purchase orders, delivery proofs and
            correspondence in one place, verifies the evidence behind every payment claim,
            and helps you follow up before a delay becomes a collection problem.
          </p>

          <div className="landing-hero__ctas">
            <button type="button" className="landing-btn-primary" onClick={() => navigate('/register')}>
              Get Started
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="landing-btn-ghost"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <PlayCircle size={17} />
              Watch How It Works
            </button>
          </div>

          <div className="landing-hero__trust">
            <div className="landing-hero__trust-item">
              <strong>Centralized</strong>
              <span>Documents &amp; evidence</span>
            </div>
            <div className="landing-hero__trust-item">
              <strong>AI-verified</strong>
              <span>Evidence matching</span>
            </div>
            <div className="landing-hero__trust-item">
              <strong>Proactive</strong>
              <span>Follow-up &amp; escalation</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="landing-hero__visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        >
          <div
            className="landing-hero__glow-orb"
            style={{
              width: 340, height: 340, top: '5%', left: '2%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)',
            }}
          />
          <div
            className="landing-hero__glow-orb"
            style={{
              width: 300, height: 300, bottom: '0%', right: '0%',
              background: 'radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)',
              animationDelay: '-8s',
            }}
          />

          <div className="landing-hero__panel">
            <div className="landing-hero__panel-head">
              <span className="landing-hero__panel-title">Evidence Readiness</span>
              <span className="landing-hero__panel-dots">
                <span /><span /><span />
              </span>
            </div>

            <div className="landing-hero__ring-row">
              <div className="landing-hero__ring">
                <div className="val">92%</div>
                <div className="lbl">Evidence Ready</div>
              </div>
              <div className="landing-hero__ring">
                <div className="val">₹4.8L</div>
                <div className="lbl">Follow-up Value</div>
              </div>
            </div>

            <div className="landing-hero__bar-row" aria-hidden="true">
              {[38, 62, 48, 80, 55, 90, 70, 40, 66, 58].map((h, i) => (
                <div key={i} className="landing-hero__bar" style={{ height: `${h}%` }} />
              ))}
            </div>

            <div className="landing-hero__list-row">
              <span className="name">INV-1042 · Kavya Textiles</span>
              <span className="badge paid" style={{ fontSize: '9.5px', padding: '3px 8px' }}>Verified</span>
            </div>
            <div className="landing-hero__list-row">
              <span className="name">INV-1039 · Orion Traders</span>
              <span className="badge due_soon" style={{ fontSize: '9.5px', padding: '3px 8px' }}>Due Soon</span>
            </div>
            <div className="landing-hero__list-row">
              <span className="name">INV-1031 · Sri Fabricators</span>
              <span className="badge overdue" style={{ fontSize: '9.5px', padding: '3px 8px' }}>Follow Up</span>
            </div>
          </div>

          <div className="landing-hero__floaters">
            {FLOATERS.map(({ label, icon: Icon, top, left, delay }) => (
              <div
                key={label}
                className="landing-hero__floater"
                style={{ top, left, animationDelay: `${delay}s` }}
              >
                <span className="ic"><Icon size={13} color="#a5b4ff" /></span>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
