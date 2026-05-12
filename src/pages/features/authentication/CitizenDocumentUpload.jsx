import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaClock, FaDownload, FaTrash, FaUser } from 'react-icons/fa';
import api from '../../../config/axios.config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import './CitizenDocumentUpload.css';

const CitizenDocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('IDENTITY_PROOF');
  const [description, setDescription] = useState('');
  const [citizenId, setCitizenId] = useState(null);
  
  const { user } = useSelector((state) => state.auth);

  // Document types available for citizens
  const documentTypes = [
    { value: 'IDENTITY_PROOF', label: 'Identity Proof (Aadhar/PAN/Passport)' },
    { value: 'ADDRESS_PROOF', label: 'Address Proof (Utility Bill/Lease Agreement)' },
    { value: 'QUALIFICATION', label: 'Educational Qualification Certificate' },
    { value: 'EXPERIENCE_LETTER', label: 'Experience Letter (if applicable)' },
    { value: 'OTHER', label: 'Other Documents' }
  ];

  // Fetch citizen ID and documents on component load
  useEffect(() => {
    const getCitizenId = async () => {
      try {
        // Try to get from localStorage first
        let id = localStorage.getItem('citizenId');
        
        // If not found, try to get from Redux user object
        if (!id && user?.id) {
          id = user.id;
          localStorage.setItem('citizenId', id);
        }
        
        if (id) {
          setCitizenId(id);
          fetchDocuments(id);
        } else {
          toast.error('Unable to identify citizen. Please login again.');
        }
      } catch (error) {
        console.error('Error getting citizen ID:', error);
        toast.error('Failed to initialize document upload');
      }
    };
    getCitizenId();
  }, [user]);

  const fetchDocuments = async (id) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`http://localhost:8081/api/citizen-documents/citizen/${id}`);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      // Validate file type (PDF, DOC, DOCX, JPG, PNG)
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, Word, JPG, and PNG files are allowed');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    if (!documentType) {
      toast.error('Please select a document type');
      return;
    }

    if (!citizenId) {
      toast.error('Unable to identify citizen. Please login again.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('docType', documentType);

    try {
      const response = await api.post(
        `http://localhost:8081/api/citizen-documents/upload?citizenId=${citizenId}&docType=${documentType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
      setDocumentType('IDENTITY_PROOF');
      setDescription('');
      
      // Reset file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
      
      fetchDocuments(citizenId);
    } catch (error) {
      console.error('Error uploading document:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload document';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`http://localhost:8081/api/citizen-documents/${documentId}`);
      toast.success('Document deleted successfully');
      fetchDocuments(citizenId);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = async (doc) => {
    try {
      // Open file in new tab if fileURI is available
      if (doc.fileURI) {
        window.open(doc.fileURI, '_blank');
        toast.success('Document download started');
      } else {
        toast.error('File URI not available');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return <span className="status-badge approved"><FaCheckCircle /> Verified</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
      case 'PENDING':
      case 'UNVERIFIED':
        return <span className="status-badge pending"><FaClock /> Pending</span>;
      default:
        return <span className="status-badge pending"><FaClock /> {status}</span>;
    }
  };

  return (
    <div className="citizen-document-container">
      <div className="document-header">
        <div className="header-content">
          <h1><FaFileUpload /> Document Management</h1>
          <p>Upload and manage your documents for verification</p>
        </div>
      </div>

      <div className="document-tabs-container">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <h2>Upload New Document</h2>
            <form onSubmit={handleUpload} className="document-form">
              <div className="form-group">
                <label htmlFor="docType">Document Type *</label>
                <select
                  id="docType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="form-control"
                  required
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  placeholder="Add any additional information about this document"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fileInput">Select File *</label>
                <div className="file-input-wrapper">
                  <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileSelect}
                    className="file-input"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    required
                  />
                  <div className="file-input-label">
                    <FaFileUpload /> 
                    {selectedFile ? selectedFile.name : 'Choose file or drag and drop'}
                  </div>
                </div>
                <small>Supported formats: PDF, Word, JPG, PNG (Max 5MB)</small>
              </div>

              <button
                type="submit"
                className="upload-button"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>

        {/* Documents List Section */}
        <div className="documents-section">
          <div className="section-header">
            <h2>Your Documents ({documents.length})</h2>
            <button className="refresh-btn" onClick={() => fetchDocuments(citizenId)} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="empty-state">
              <FaUser className="empty-icon" />
              <p>No documents uploaded yet. Upload your first document above.</p>
            </div>
          ) : (
            <div className="documents-list">
              {documents.map(doc => (
                <div key={doc.documentId} className="document-card">
                  <div className="document-card-header">
                    <div className="document-info">
                      <h4 className="document-type">{doc.docType}</h4>
                      <p className="document-uploaded">
                        Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="document-status">
                      {getStatusBadge(doc.verificationStatus)}
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(doc)}
                      title="Download"
                    >
                      <FaDownload /> Download
                    </button>
                    {doc.verificationStatus !== 'VERIFIED' && doc.verificationStatus !== 'APPROVED' && (
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(doc.documentId)}
                        title="Delete"
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDocumentUpload;
