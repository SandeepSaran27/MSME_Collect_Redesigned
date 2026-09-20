import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import {
  UploadCloud, ScanSearch, BellRing, Wallet,
  FileText, Receipt, Truck, CheckCircle2, Link2, Clock, Send, BadgeCheck,
} from 'lucide-react';
import StickyProcessCard from './StickyProcessCard';

const NUM_STEPS = 4;
const SEGMENT = 1 / NUM_STEPS; // 0.25
const ENTER = 0.08;

const STEPS = [
  {
    step: 1,
    title: 'Upload & Organize Documents',
    desc: 'Upload invoices, purchase orders, delivery proofs and correspondence — MSME Collect keeps every document organized by customer and invoice.',
    metaLabel: '4 document types supported',
    icon: UploadCloud,
    accent: 'rgba(99,102,241,0.55)',
    glow: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)',
    iconBg: 'linear-gradient(135deg, #6366f1, #4f6bff)',
    labelColor: '#a5b4ff',
  },
  {
    step: 2,
    title: 'AI Extracts & Verifies Evidence',
    desc: 'The system reads each document, extracts the key fields, and cross-checks purchase orders against invoices and delivery proof.',
    metaLabel: 'Automated field extraction',
    icon: ScanSearch,
    accent: 'rgba(34,211,238,0.55)',
    glow: 'radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)',
    iconBg: 'linear-gradient(135deg, #22d3ee, #4f6bff)',
    labelColor: '#67e8f9',
  },
  {
    step: 3,
    title: 'Track & Follow Up',
    desc: 'Monitor payment status across your ledger and get contextual reminder and follow-up support before a delay escalates.',
    metaLabel: 'Live status tracking',
    icon: BellRing,
    accent: 'rgba(217,70,239,0.5)',
    glow: 'radial-gradient(circle, rgba(217,70,239,0.35), transparent 70%)',
    iconBg: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
    labelColor: '#e9a8ff',
  },
  {
    step: 4,
    title: 'Get Paid Faster',
    desc: 'Stay evidence-ready at every stage and take action early — before a payment delay becomes a collection problem.',
    metaLabel: 'Evidence-ready workflow',
    icon: Wallet,
    accent: 'rgba(245,158,11,0.5)',
    glow: 'radial-gradient(circle, rgba(245,158,11,0.35), transparent 70%)',
    iconBg: 'linear-gradient(135deg, #f59e0b, #8b5cf6)',
    labelColor: '#fbbf24',
  },
];

const StepVisual = ({ step }) => {
  if (step === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '0 8px' }}>
        <div className="doc-chip"><FileText size={14} color="#a5b4ff" /> Invoice · INV-1042</div>
        <div className="doc-chip" style={{ marginLeft: 22 }}><Receipt size={14} color="#a5b4ff" /> Purchase Order · PO-2291</div>
        <div className="doc-chip" style={{ marginLeft: 8 }}><Truck size={14} color="#a5b4ff" /> Delivery Proof · DC-0847</div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', padding: '0 8px' }}>
        <div className="doc-chip" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Receipt size={14} color="#67e8f9" /> PO-2291</span>
          <Link2 size={13} color="#67e8f9" />
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={14} color="#67e8f9" /> INV-1042</span>
        </div>
        <div className="doc-chip" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={14} color="#67e8f9" /> INV-1042</span>
          <Link2 size={13} color="#67e8f9" />
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Truck size={14} color="#67e8f9" /> DC-0847</span>
        </div>
        <div className="doc-chip" style={{ color: '#34d399' }}>
          <CheckCircle2 size={14} color="#34d399" /> Evidence 92% verified
        </div>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '0 8px' }}>
        <div className="doc-chip"><Clock size={14} color="#e9a8ff" /> Due in 3 days · INV-1039</div>
        <div className="doc-chip" style={{ marginLeft: 16 }}><Send size={14} color="#e9a8ff" /> Reminder sent · Orion Traders</div>
        <div className="doc-chip" style={{ marginLeft: 32 }}><BellRing size={14} color="#e9a8ff" /> Follow-up scheduled</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '0 8px' }}>
      <div className="doc-chip"><BadgeCheck size={14} color="#fbbf24" /> Evidence Ready</div>
      <div className="doc-chip" style={{ marginLeft: 16 }}><Send size={14} color="#fbbf24" /> Payment Follow-up Sent</div>
      <div className="doc-chip" style={{ marginLeft: 32, color: '#34d399' }}>
        <CheckCircle2 size={14} color="#34d399" /> Payment Received
      </div>
    </div>
  );
};

const StickyProcessSection = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(NUM_STEPS - 1, Math.max(0, Math.floor(v * NUM_STEPS)));
      setActiveIndex(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const cardConfigs = useMemo(
    () =>
      STEPS.map((_, i) => {
        const enterStart = i * SEGMENT;
        const enterEnd = enterStart + ENTER;
        const isLast = i === NUM_STEPS - 1;
        const holdEnd = isLast ? 1 : (i + 1) * SEGMENT;

        const scaleFinal = 0.94 - (NUM_STEPS - 2 - i) * 0.04;
        const yFinal = -10 * (NUM_STEPS - 1 - i);
        const opacityFinal = Math.max(0.6, 1 - 0.12 * (NUM_STEPS - 1 - i));
        const rotateFinal = -1.1 * (NUM_STEPS - 1 - i);

        if (isLast) {
          return {
            input: [enterStart, enterEnd, 1],
            scale: [0.88, 1, 1],
            y: [70, 0, 0],
            opacity: [0, 1, 1],
            rotate: [-2, 0, 0],
          };
        }

        return {
          input: [enterStart, enterEnd, holdEnd, 1],
          scale: [0.88, 1, 1, scaleFinal],
          y: [70, 0, 0, yFinal],
          opacity: [0, 1, 1, opacityFinal],
          rotate: [-2, 0, 0, rotateFinal],
        };
      }),
    []
  );

  // Fixed hook count: always create exactly NUM_STEPS sets of transforms.
  const c0 = cardConfigs[0];
  const c1 = cardConfigs[1];
  const c2 = cardConfigs[2];
  const c3 = cardConfigs[3];

  const scale0 = useTransform(scrollYProgress, c0.input, c0.scale);
  const y0 = useTransform(scrollYProgress, c0.input, c0.y);
  const opacity0 = useTransform(scrollYProgress, c0.input, c0.opacity);
  const rotate0 = useTransform(scrollYProgress, c0.input, c0.rotate);

  const scale1 = useTransform(scrollYProgress, c1.input, c1.scale);
  const y1 = useTransform(scrollYProgress, c1.input, c1.y);
  const opacity1 = useTransform(scrollYProgress, c1.input, c1.opacity);
  const rotate1 = useTransform(scrollYProgress, c1.input, c1.rotate);

  const scale2 = useTransform(scrollYProgress, c2.input, c2.scale);
  const y2 = useTransform(scrollYProgress, c2.input, c2.y);
  const opacity2 = useTransform(scrollYProgress, c2.input, c2.opacity);
  const rotate2 = useTransform(scrollYProgress, c2.input, c2.rotate);

  const scale3 = useTransform(scrollYProgress, c3.input, c3.scale);
  const y3 = useTransform(scrollYProgress, c3.input, c3.y);
  const opacity3 = useTransform(scrollYProgress, c3.input, c3.opacity);
  const rotate3 = useTransform(scrollYProgress, c3.input, c3.rotate);

  const motionByIndex = [
    { scale: scale0, y: y0, opacity: opacity0, rotate: rotate0 },
    { scale: scale1, y: y1, opacity: opacity1, rotate: rotate1 },
    { scale: scale2, y: y2, opacity: opacity2, rotate: rotate2 },
    { scale: scale3, y: y3, opacity: opacity3, rotate: rotate3 },
  ];

  return (
    <section className="stack-section" id="how-it-works">
      <div className="landing-container">
        <div className="landing-section__head" style={{ marginBottom: 32 }}>
          <span className="landing-section__eyebrow">HOW MSME COLLECT WORKS</span>
          <h2 className="landing-section__title">From Documents to Payments</h2>
          <p className="landing-section__sub">
            Scroll to move through the workflow — each step stacks on the last, the
            way your documents actually build into a payment-ready case.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="stack-scroller" style={{ height: `${NUM_STEPS * 100}vh` }}>
        <div className="stack-sticky">
          <div className="stack-sticky__frame">
            {STEPS.map((s, i) => (
              <StickyProcessCard
                key={s.step}
                step={s.step}
                index={i}
                title={s.title}
                desc={s.desc}
                metaLabel={s.metaLabel}
                icon={s.icon}
                accent={s.accent}
                glow={s.glow}
                iconBg={s.iconBg}
                labelColor={s.labelColor}
                style={{
                  scale: motionByIndex[i].scale,
                  y: motionByIndex[i].y,
                  opacity: motionByIndex[i].opacity,
                  rotate: motionByIndex[i].rotate,
                  zIndex: 10 + i,
                }}
              >
                <StepVisual step={s.step} />
              </StickyProcessCard>
            ))}

            <div className="stack-progress">
              {STEPS.map((s, i) => (
                <span key={s.step} className={`stack-progress__dot ${activeIndex === i ? 'is-active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyProcessSection;
