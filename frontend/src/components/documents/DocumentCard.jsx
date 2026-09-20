import React, { useState } from 'react';
import { extractDocumentData } from '../../services/aiService';
import { FileText, Cpu, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const DocumentCard = ({ document, onDelete, onExtractSuccess }) => {
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setExtracting(true);
    setError(null);
    try {
      await extractDocumentData(document._id);
      setExtracting(false);
      if (onExtractSuccess) onExtractSuccess();
    } catch (err) {
      setExtracting(false);
      setError(err.response?.data?.message || 'Extraction failed.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={12} /> Completed
          </span>
        );
      case 'processing':
        return (
          <span className="badge due_soon" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Processing
          </span>
        );
      case 'failed':
        return (
          <span className="badge overdue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} /> Failed
          </span>
        );
      default:
        return (
          <span className="badge upcoming" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Pending OCR
          </span>
        );
    }
  };

  const renderExtractedFields = () => {
    const data = document.extractedData || {};
    if (Object.keys(data).length === 0) {
      return <p style={{ fontSize: '12px', color: '#64748b' }}>No structured AI data extracted yet.</p>;
    }

    return (
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px' }}>
        {data.invoiceNumber && <p><strong>Invoice Number:</strong> {data.invoiceNumber}</p>}
        {data.poNumber && <p><strong>PO Number:</strong> {data.poNumber}</p>}
        {data.customerName && <p><strong>Customer:</strong> {data.customerName}</p>}
        {data.amount !== undefined && <p><strong>Amount:</strong> ${data.amount}</p>}
        {data.orderDate && <p><strong>Order Date:</strong> {data.orderDate}</p>}
        {data.deliveryDate && <p><strong>Delivery Date:</strong> {data.deliveryDate}</p>}
        {data.deliveryStatus && <p><strong>Delivery Status:</strong> {data.deliveryStatus}</p>}
        {data.importantDates && <p><strong>Dates Ref:</strong> {data.importantDates.join(', ')}</p>}
        {data.summary && <p><strong>Summary:</strong> {data.summary}</p>}
        {data.transactionReference && <p><strong>Txn Ref:</strong> {data.transactionReference}</p>}
      </div>
    );
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={22} color="#4f6bff" />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>{document.originalName}</h4>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Type: <span style={{ textTransform: 'capitalize' }}>{document.type.replace('_', ' ')}</span> • Uploaded: {new Date(document.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {getStatusBadge(document.extractionStatus)}
          <button onClick={() => onDelete(document._id)} className="danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ fontSize: '12px' }}>{error}</div>}

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Structured AI Extractions:</div>
        {renderExtractedFields()}
      </div>

      {(document.extractionStatus === 'pending' || document.extractionStatus === 'failed') && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleExtract} className="secondary" disabled={extracting} style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Cpu size={14} />
            {extracting ? 'Running AI Extraction...' : 'Extract Data via AI'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
