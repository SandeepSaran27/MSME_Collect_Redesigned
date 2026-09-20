import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvoiceById, updateInvoice } from '../services/invoiceService';
import { getDocumentsByInvoice, deleteDocument } from '../services/documentService';
import { getEvidenceReadiness, downloadEvidenceReport } from '../services/evidenceService';
import { createReminder } from '../services/reminderService';
import { escalateInvoice } from '../services/escalationService';

import InvoiceStatusBadge from '../components/invoices/InvoiceStatusBadge';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentList from '../components/documents/DocumentList';
import EvidenceScore from '../components/evidence/EvidenceScore';
import EvidenceChecklist from '../components/evidence/EvidenceChecklist';
import MatchingResults from '../components/evidence/MatchingResults';
import MissingEvidence from '../components/evidence/MissingEvidence';
import EvidenceWarnings from '../components/evidence/EvidenceWarnings';
import EscalationForm from '../components/escalation/EscalationForm';

import { ArrowLeft, FileText, Send, AlertTriangle, Download, CheckCircle, Clock } from 'lucide-react';

const InvoiceDetails = () => {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [evidenceData, setEvidenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  const [reminderType, setReminderType] = useState('overdue');
  const [reminderMsg, setReminderMsg] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchAllInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, docRes, evRes] = await Promise.all([
        getInvoiceById(id),
        getDocumentsByInvoice(id),
        getEvidenceReadiness(id),
      ]);
      setInvoice(invRes.data);
      setDocuments(docRes.data);
      setEvidenceData(evRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoice details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoiceDetails();
  }, [id]);

  const handleDocumentDelete = async (docId) => {
    if (window.confirm('Delete this supporting document?')) {
      try {
        await deleteDocument(docId);
        fetchAllInvoiceDetails();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete document');
      }
    }
  };

  const handleTogglePaymentStatus = async () => {
    if (!invoice) return;
    const newPaymentStatus = invoice.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      const res = await updateInvoice(invoice._id, { paymentStatus: newPaymentStatus });
      setInvoice(res.data);
      fetchAllInvoiceDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleSendReminder = async (e) => {
    e.preventDefault();
    setSendingReminder(true);
    try {
      await createReminder(invoice._id, { type: reminderType, message: reminderMsg });
      setSendingReminder(false);
      setShowReminderModal(false);
      alert('Payment reminder triggered and queued successfully!');
    } catch (err) {
      setSendingReminder(false);
      alert(err.response?.data?.message || 'Failed to trigger reminder');
    }
  };

  const handleEscalateSubmit = async (escalationPayload) => {
    setEscalating(true);
    try {
      await escalateInvoice(invoice._id, escalationPayload);
      setEscalating(false);
      setShowEscalateModal(false);
      fetchAllInvoiceDetails();
    } catch (err) {
      setEscalating(false);
      alert(err.response?.data?.message || 'Escalation failed');
    }
  };

  const handleDownloadReport = async () => {
    setPdfLoading(true);
    try {
      await downloadEvidenceReport(invoice._id, invoice.invoiceNumber);
    } catch (err) {
      alert('Failed to generate PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#94a3b8', padding: '40px 0', textAlign: 'center' }}>Loading invoice details workspace...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="alert alert-danger" style={{ margin: '20px 0' }}>
        {error || 'Invoice not found'}
      </div>
    );
  }

  const customer = invoice.customer || {};

  return (
    <div>
      {/* Header & Nav */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/invoices" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to Invoices Ledger
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>Invoice #{invoice.invoiceNumber}</h1>
              <InvoiceStatusBadge status={invoice.invoiceStatus} />
              <InvoiceStatusBadge status={invoice.paymentStatus} />
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
              Customer: <strong>{customer.companyName || customer.name}</strong> • Created: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Button Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleTogglePaymentStatus} className={invoice.paymentStatus === 'paid' ? 'secondary' : 'success'}>
              <CheckCircle size={16} />
              {invoice.paymentStatus === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
            </button>

            <button onClick={() => setShowReminderModal(true)} className="primary">
              <Send size={16} /> Send Reminder
            </button>

            {invoice.invoiceStatus !== 'escalated' && invoice.paymentStatus !== 'paid' && (
              <button onClick={() => setShowEscalateModal(true)} className="danger">
                <AlertTriangle size={16} /> Escalate Invoice
              </button>
            )}

            <button onClick={handleDownloadReport} className="secondary" disabled={pdfLoading}>
              <Download size={16} /> {pdfLoading ? 'Generating PDF...' : 'Evidence Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Invoice Amount</span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>${invoice.amount.toLocaleString()}</div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Due Date Status</span>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', marginTop: '8px' }}>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            {invoice.daysOverdue > 0 ? (
              <span style={{ color: '#ef4444', fontWeight: '600' }}>{invoice.daysOverdue} days overdue</span>
            ) : (
              <span>Due in {invoice.daysUntilDue} days</span>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>PO Number</span>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', marginTop: '8px' }}>
            {invoice.poNumber || 'No PO Specified'}
          </div>
        </div>
      </div>

      {/* Evidence Alerts Banner */}
      <MissingEvidence missingDocuments={evidenceData?.missingDocuments} />
      <EvidenceWarnings warnings={evidenceData?.matchingResults?.warnings} />

      {/* Section Grid: Left = Document Manager, Right = Evidence Readiness */}
      <div className="grid-2">
        <div>
          <DocumentUpload invoiceId={invoice._id} onUploadSuccess={fetchAllInvoiceDetails} />
          <DocumentList
            documents={documents}
            onDelete={handleDocumentDelete}
            onExtractSuccess={fetchAllInvoiceDetails}
          />
        </div>

        <div>
          <EvidenceScore score={evidenceData?.score || 0} />
          <EvidenceChecklist documents={evidenceData?.documents} />
          <MatchingResults matchingResults={evidenceData?.matchingResults} />
        </div>
      </div>

      {/* Trigger Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc' }}>
              Send Payment Reminder Notice
            </h2>
            <form onSubmit={handleSendReminder}>
              <div className="form-group">
                <label>Reminder Type</label>
                <select value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
                  <option value="due_soon">Friendly Due Soon Notice</option>
                  <option value="due_today">Due Today Notice</option>
                  <option value="overdue">Urgent Overdue Payment Request</option>
                  <option value="escalation">Official Escalation Notice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Custom Message Note (Optional)</label>
                <textarea
                  rows="3"
                  value={reminderMsg}
                  onChange={(e) => setReminderMsg(e.target.value)}
                  placeholder="Enter additional message context for the client..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="secondary" onClick={() => setShowReminderModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={sendingReminder}>
                  {sendingReminder ? 'Sending Email...' : 'Send Reminder Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalate Invoice Modal */}
      {showEscalateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>
              Escalate Overdue Invoice #{invoice.invoiceNumber}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Escalating freezes evidence snapshots and records formal recovery tracking.
            </p>
            <EscalationForm
              invoice={invoice}
              onSubmit={handleEscalateSubmit}
              onCancel={() => setShowEscalateModal(false)}
              isSubmitting={escalating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
