import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Clock, FolderOpenDot, Eye } from 'lucide-react';

const IMPACT_ITEMS = [
  {
    icon: BadgeCheck,
    title: 'Evidence Readiness',
    desc: 'Every invoice carries a live readiness score, so you always know what documentation still needs attention.',
  },
  {
    icon: Clock,
    title: 'Faster Follow-up',
    desc: 'Contextual reminders and escalation paths mean payment conversations start before delays compound.',
  },
  {
    icon: FolderOpenDot,
    title: 'Centralized Documents',
    desc: 'Invoices, purchase orders, delivery proofs and correspondence — organized in one workspace, per customer.',
  },
  {
    icon: Eye,
    title: 'Payment Visibility',
    desc: 'A clear, real-time view of upcoming, due, overdue and paid invoices across your entire business.',
  },
];

const ImpactSection = () => (
  <section className="landing-section landing-impact" id="impact">
    <div className="landing-container">
      <div className="landing-section__head">
        <span className="landing-section__eyebrow">WHY IT MATTERS</span>
        <h2 className="landing-section__title">Built around how MSMEs actually get paid</h2>
        <p className="landing-section__sub">
          MSME Collect turns scattered paperwork into a structured, evidence-backed
          workflow — so collection conversations start from facts, not guesswork.
        </p>
      </div>

      <div className="landing-impact-grid">
        {IMPACT_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            className="landing-impact-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
          >
            <div className="icon-wrap">
              <item.icon size={19} color="#a5b4ff" />
            </div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
