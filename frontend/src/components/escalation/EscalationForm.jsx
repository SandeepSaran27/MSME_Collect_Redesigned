import React, { useState } from 'react';

const EscalationForm = ({ invoice, onSubmit, onCancel, isSubmitting }) => {
  const [reason, setReason] = useState('Severe payment delay beyond contract terms (>30 days)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reason, notes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Escalation Reason *</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} required>
          <option value="Severe payment delay beyond contract terms (>30 days)">Severe payment delay beyond contract terms (&gt;30 days)</option>
          <option value="Customer unresponsive to payment reminders">Customer unresponsive to payment reminders</option>
          <option value="Disputed invoice line items without delivery evidence">Disputed invoice line items</option>
          <option value="High risk default indicator">High risk default indicator</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Additional Evidence & Collection Notes</label>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Include any relevant context or customer communications..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="danger" disabled={isSubmitting}>
          {isSubmitting ? 'Escalating...' : 'Confirm Escalation'}
        </button>
      </div>
    </form>
  );
};

export default EscalationForm;
