import React, { useState } from 'react';
import { uploadDocument } from '../../services/documentService';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentUpload = ({ invoiceId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('purchase_order');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('invoiceId', invoiceId);
      formData.append('type', type);

      await uploadDocument(formData);
      setUploading(false);
      setSuccess(true);
      setFile(null);
      
      // Reset input element
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) fileInput.value = '';

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || 'File upload failed. Max size is 10MB.');
    }
  };

  return (
    <div className="card" style={{ border: '2px dashed var(--border)', backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload size={18} color="#4f6bff" />
        Upload Evidence Document
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Document uploaded successfully! Metadata saved.</div>}

      <form onSubmit={handleUpload}>
        <div className="grid-2">
          <div className="form-group">
            <label>Document Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="purchase_order">Purchase Order (PO)</option>
              <option value="invoice">Invoice Document</option>
              <option value="delivery_receipt">Delivery Receipt / POD</option>
              <option value="correspondence">Correspondence / Communication</option>
              <option value="payment_proof">Payment Proof (Receipt/Wire)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select File (PDF, PNG, JPG, JPEG ≤ 10MB) *</label>
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="primary" disabled={uploading || !file}>
            {uploading ? 'Uploading & Processing...' : 'Upload & Extract Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
