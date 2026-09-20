import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pure presentational card used inside StickyProcessSection.
 * All motion values (scale / y / opacity / rotate / zIndex) are computed
 * by the parent from a single scroll-driven progress value, so this
 * component just renders the visuals for a given step.
 */
const StickyProcessCard = ({
  style,
  step,
  index,
  title,
  desc,
  metaLabel,
  icon: Icon,
  accent,
  glow,
  iconBg,
  labelColor,
  children,
}) => {
  return (
    <motion.div
      className="stack-card"
      style={{
        '--stack-accent': accent,
        '--stack-glow': glow,
        '--stack-icon-bg': iconBg,
        '--stack-label': labelColor,
        ...style,
      }}
    >
      <div>
        <div className="stack-card__icon-badge">
          <Icon size={20} color="#fff" />
        </div>
        <div className="stack-card__step">STEP 0{step}</div>
        <h3 className="stack-card__title">{title}</h3>
        <p className="stack-card__desc">{desc}</p>
        <span className="stack-card__meta">{metaLabel}</span>
      </div>

      <div className="stack-card__visual">
        {children}
      </div>
    </motion.div>
  );
};

export default StickyProcessCard;
