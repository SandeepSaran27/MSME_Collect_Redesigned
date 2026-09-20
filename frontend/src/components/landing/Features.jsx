import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, ShieldCheck, LineChart, BellRing, BadgeCheck, BarChart3,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Document Intelligence',
    desc: 'Automatically extract key fields from invoices, purchase orders and delivery proofs — no manual data entry.',
    accent: 'rgba(99,102,241,0.55)',
    iconBg: 'rgba(99,102,241,0.16)',
    iconGlow: 'rgba(99,102,241,0.45)',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence Matching',
    desc: 'Cross-check purchase orders against invoices and delivery proof so every claim is backed by real evidence.',
    accent: 'rgba(34,211,238,0.5)',
    iconBg: 'rgba(34,211,238,0.14)',
    iconGlow: 'rgba(34,211,238,0.4)',
  },
  {
    icon: LineChart,
    title: 'Payment Tracking',
    desc: 'See every invoice status at a glance — upcoming, due soon, overdue or paid — across your entire ledger.',
    accent: 'rgba(217,70,239,0.45)',
    iconBg: 'rgba(217,70,239,0.14)',
    iconGlow: 'rgba(217,70,239,0.4)',
  },
  {
    icon: BellRing,
    title: 'Smart Follow-ups',
    desc: 'Trigger timely, contextual reminders and escalation workflows before a delay becomes a collection issue.',
    accent: 'rgba(245,158,11,0.45)',
    iconBg: 'rgba(245,158,11,0.14)',
    iconGlow: 'rgba(245,158,11,0.4)',
  },
  {
    icon: BadgeCheck,
    title: 'Evidence Readiness',
    desc: 'Get a live readiness score for every invoice, so you know exactly what documentation is still missing.',
    accent: 'rgba(139,92,246,0.5)',
    iconBg: 'rgba(139,92,246,0.16)',
    iconGlow: 'rgba(139,92,246,0.4)',
  },
  {
    icon: BarChart3,
    title: 'Business Insights',
    desc: 'Understand collection performance across customers and time, so you can prioritize where it matters most.',
    accent: 'rgba(34,211,238,0.4)',
    iconBg: 'rgba(34,211,238,0.14)',
    iconGlow: 'rgba(34,211,238,0.35)',
  },
];

const Features = () => (
  <section className="landing-section" id="features">
    <div className="landing-container">
      <div className="landing-section__head">
        <span className="landing-section__eyebrow">CAPABILITIES</span>
        <h2 className="landing-section__title">Everything you need to get paid on time</h2>
        <p className="landing-section__sub">
          MSME Collect brings your documents, evidence and payment status into a single,
          AI-assisted workspace built for how MSMEs actually get paid.
        </p>
      </div>

      <div className="landing-features-grid">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className="landing-feature-card"
            style={{ '--card-accent': f.accent }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: 'easeOut' }}
          >
            <div
              className="landing-feature-icon"
              style={{ '--icon-bg': f.iconBg, '--icon-glow': f.iconGlow }}
            >
              <f.icon size={21} color="#fff" />
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
