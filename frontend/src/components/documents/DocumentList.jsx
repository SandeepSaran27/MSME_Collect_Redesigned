import React from 'react';
import DocumentCard from './DocumentCard';

const DocumentList = ({ documents, onDelete, onExtractSuccess }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
        No supporting documents uploaded for this invoice yet.
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc' }}>
        Uploaded Supporting Evidence ({documents.length})
      </h3>
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onDelete={onDelete}
          onExtractSuccess={onExtractSuccess}
        />
      ))}
    </div>
  );
};

export default DocumentList;
