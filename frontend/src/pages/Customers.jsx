import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../services/customerService';
import { Users, Plus, Trash2, Mail, Phone, Building } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });

  const fetchCustomersList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createCustomer(formData);
      setIsSubmitting(false);
      setShowModal(false);
      setFormData({ name: '', companyName: '', email: '', phone: '', address: '', taxId: '' });
      fetchCustomersList();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Failed to create customer.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomersList();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Customer Directory"
        title="Customers"
        subtitle="Manage client records and billing profiles"
        actions={
          <button onClick={() => setShowModal(true)} className="primary" style={{ height: '44px', padding: '0 20px' }}>
            <Plus size={18} /> Add New Customer
          </button>
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading customers...</p>
      ) : customers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <Users size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>No customer profiles found.</p>
          <button onClick={() => setShowModal(true)} className="primary" style={{ marginTop: '16px' }}>
            Add First Customer
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Primary Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Tax ID / GSTIN</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building size={16} color="#4f6bff" />
                        {c.companyName}
                      </strong>
                    </td>
                    <td>{c.name}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} color="#94a3b8" /> {c.email}
                      </span>
                    </td>
                    <td>{c.phone ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="#94a3b8" /> {c.phone}</span> : '—'}</td>
                    <td>{c.taxId || '—'}</td>
                    <td>
                      <button onClick={() => handleDeleteCustomer(c._id)} className="danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc' }}>
              Add New Customer Profile
            </h2>
            <form onSubmit={handleCreateCustomer}>
              <div className="form-group">
                <label>Company / Organization Name *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Logistics Pvt Ltd" />
              </div>

              <div className="form-group">
                <label>Contact Person Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Smith" />
              </div>

              <div className="form-group">
                <label>Billing Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="billing@acme.com" />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0199" />
                </div>
                <div className="form-group">
                  <label>Tax ID / GSTIN</label>
                  <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="TAX-998877" />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Financial Way, Suite 400" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
