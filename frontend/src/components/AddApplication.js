import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AddApplication.css';

function AddApplication({ onApplicationAdded, onClose }) {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    location: '',
    salaryRange: '',
    jobUrl: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Success! Call parent callback
      onApplicationAdded(response.data.application);
      
      // Reset form
      setFormData({
        company: '',
        position: '',
        status: 'applied',
        location: '',
        salaryRange: '',
        jobUrl: '',
        notes: ''
      });

      // Close modal if provided
      if (onClose) onClose();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-application-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Application</h2>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google"
                required
              />
            </div>

            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="wishlist">📋 Wishlist</option>
                <option value="applied">📤 Applied</option>
                <option value="phone_screen">📞 Phone Screen</option>
                <option value="technical">💻 Technical Interview</option>
                <option value="onsite">🏢 Onsite Interview</option>
                <option value="offer">✅ Offer</option>
                <option value="rejected">❌ Rejected</option>
                <option value="ghosted">👻 Ghosted</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, San Francisco"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g., $80k - $120k"
              />
            </div>

            <div className="form-group">
              <label>Job URL</label>
              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            {onClose && (
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddApplication;