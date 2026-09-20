import React, { useState } from 'react';

const InvoiceForm = ({ customers, onSubmit, initialValues = {}, isSubmitting }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: initialValues.invoiceNumber || '',
    customer: initialValues.customer?._id || initialValues.customer || '',
    amount: initialValues.amount || '',
    invoiceDate: initialValues.invoiceDate ? new Date(initialValues.invoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: initialValues.dueDate ? new Date(initialValues.dueDate).toISOString().split('T')[0] : '',
    poNumber: initialValues.poNumber || '',
    description: initialValues.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label>Customer *</label>
          <select name="customer" value={formData.customer} onChange={handleChange} required>
            <option value="">Select a Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName} ({c.name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Invoice Number *</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="e.g. INV-2026-001"
            required
          />
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label>Invoice Amount ($) *</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Invoice Date *</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date *</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>PO Number (Optional)</label>
          <input
            type="text"
            name="poNumber"
            value={formData.poNumber}
            onChange={handleChange}
            placeholder="e.g. PO-98765"
          />
        </div>

        <div className="form-group">
          <label>Description / Notes</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Services or goods provided..."
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create Invoice Record'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
