import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCustomers } from '../services/customerService';
import { createInvoice } from '../services/invoiceService';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { ArrowLeft } from 'lucide-react';

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCust = async () => {
      try {
        setLoading(true);
        const res = await getCustomers();
        setCustomers(res.data);
      } catch (err) {
        setError('Failed to load customers for invoice creation.');
      } finally {
        setLoading(false);
      }
    };
    fetchCust();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await createInvoice(formData);
      setIsSubmitting(false);
      navigate(`/invoices/${res.data._id}`);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Failed to create invoice record.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link to="/invoices" className="secondary button" style={{ display: 'inline-flex', width: 'fit-content', padding: '6px 12px', fontSize: '12.5px', marginBottom: '16px' }}>
          <ArrowLeft size={14} /> Back to Invoices Ledger
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Create Invoice Record</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Register a new invoice cycle and initialize evidence readiness tracking</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading customer profiles...</p>
      ) : customers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ color: '#f59e0b', marginBottom: '12px' }}>You need to add at least one customer before creating an invoice.</p>
          <Link to="/customers" className="button primary">Go to Customer Directory</Link>
        </div>
      ) : (
        <div className="card">
          <InvoiceForm customers={customers} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
