import React from 'react';
import { Check, X } from 'lucide-react';

const EvidenceChecklist = ({ documents = {} }) => {
  const checklistItems = [
    { label: 'Purchase Order (PO)', key: 'purchase_order' },
    { label: 'Invoice Document', key: 'invoice' },
    { label: 'Delivery Receipt / POD', key: 'delivery_receipt' },
    { label: 'Correspondence / Communication', key: 'correspondence' },
    { label: 'Payment Proof (Optional)', key: 'payment_proof' },
  ];

  return (
    <div className="card">
      <div className="card-title">Required Evidence Checklist</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {checklistItems.map((item) => {
          const isPresent = !!documents[item.key];
          return (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <span style={{ fontSize: '14px', color: '#f8fafc' }}>{item.label}</span>
              {isPresent ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '600', fontSize: '13px' }}>
                  <Check size={16} /> Present
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: '600', fontSize: '13px' }}>
                  <X size={16} /> Missing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceChecklist;
