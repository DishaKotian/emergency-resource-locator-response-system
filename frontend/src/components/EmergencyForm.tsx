import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { EmergencyRequest } from '../App';

interface EmergencyFormProps {
  onSubmit: (request: Omit<EmergencyRequest, '_id' | 'timestamp' | 'status'>) => Promise<void>;
}

const emergencyTypes = [
  'Medical Emergency',
  'Fire',
  'Security Incident',
  'Natural Disaster',
  'Accident',
  'Chemical Spill',
  'Power Outage',
  'Gas Leak',
  'Other'
];

function EmergencyForm({ onSubmit }: EmergencyFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.location) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        type: formData.type,
        location: formData.location,
        description: formData.description || undefined,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium mr-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Report Emergency
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center mb-8">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Emergency Report Form
            </h2>
            <p className="text-gray-600">
              Please provide details about the emergency situation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-2">
                Emergency Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                Location *
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter the emergency location"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Be as specific as possible (street address, building name, room number)
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Provide additional details about the emergency"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={!formData.type || !formData.location || isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Emergency Report
                  </>
                )}
              </button>

              <Link
                to="/dashboard"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-md font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Important:</strong> For life-threatening emergencies, call emergency services directly before filling out this form.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmergencyForm;