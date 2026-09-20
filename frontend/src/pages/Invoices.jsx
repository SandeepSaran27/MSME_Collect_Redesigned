import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices, deleteInvoice } from '../services/invoiceService';
import { getCustomers } from '../services/customerService';
import InvoiceTable from '../components/invoices/InvoiceTable';
import InvoiceFilters from '../components/invoices/InvoiceFilters';
import { FileText, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    customer: '',
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, custRes] = await Promise.all([getInvoices(), getCustomers()]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoices data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice record?')) {
      try {
        await deleteInvoice(id);
        setInvoices((prev) => prev.filter((i) => i._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete invoice');
      }
    }
  };

  // Client side search filter
  const filteredInvoices = invoices.filter((inv) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const numMatch = inv.invoiceNumber.toLowerCase().includes(searchLower);
      const descMatch = inv.description && inv.description.toLowerCase().includes(searchLower);
      if (!numMatch && !descMatch) return false;
    }
    if (filters.status && inv.invoiceStatus !== filters.status) return false;
    if (filters.paymentStatus && inv.paymentStatus !== filters.paymentStatus) return false;
    if (filters.customer && inv.customer?._id !== filters.customer) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Invoice Ledger"
        title="Invoices"
        subtitle="Track, manage, and audit invoice payment lifecycles"
        actions={
          <Link to="/invoices/create" className="button primary" style={{ height: '44px', padding: '0 20px' }}>
            <Plus size={18} /> Create Invoice
          </Link>
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <InvoiceFilters filters={filters} onChange={handleFilterChange} customers={customers} />

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '20px 0' }}>Loading invoice ledger...</p>
        ) : (
          <InvoiceTable invoices={filteredInvoices} onDelete={handleDeleteInvoice} />
        )}
      </div>
    </div>
  );
};

export default Invoices;
