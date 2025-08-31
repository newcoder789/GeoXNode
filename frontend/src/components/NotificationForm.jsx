import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    country: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      riskLevels: ['MEDIUM', 'HIGH', 'CRITICAL'],
      frequency: 'IMMEDIATE'
    }
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const regions = [
    'Uttarakhand',
    'Himachal Pradesh',
    'Ladakh',
    'Kashmir',
    'Nepal',
    'Bhutan',
    'Tibet',
    'Other'
  ];

  const countries = [
    'India',
    'Nepal',
    'Bhutan',
    'Pakistan',
    'China',
    'Other'
  ];

  const riskLevels = [
    { value: 'LOW', label: 'Low Risk', description: 'Minor changes and alerts' },
    { value: 'MEDIUM', label: 'Medium Risk', description: 'Moderate changes and warnings' },
    { value: 'HIGH', label: 'High Risk', description: 'Significant changes and alerts' },
    { value: 'CRITICAL', label: 'Critical Risk', description: 'Emergency situations and immediate alerts' }
  ];

  const frequencies = [
    { value: 'IMMEDIATE', label: 'Immediate', description: 'Get alerts as soon as they happen' },
    { value: 'DAILY', label: 'Daily Digest', description: 'Receive a summary once per day' },
    { value: 'WEEKLY', label: 'Weekly Summary', description: 'Receive a summary once per week' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRiskLevelChange = (riskLevel) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        riskLevels: prev.preferences.riskLevels.includes(riskLevel)
          ? prev.preferences.riskLevels.filter(r => r !== riskLevel)
          : [...prev.preferences.riskLevels, riskLevel]
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    if (!formData.preferences.emailNotifications && !formData.preferences.smsNotifications) {
      newErrors.notifications = 'At least one notification method must be selected';
    }
    
    if (formData.preferences.smsNotifications && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for SMS notifications';
    }

    if (formData.preferences.riskLevels.length === 0) {
      newErrors.riskLevels = 'At least one risk level must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Successfully Subscribed!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for subscribing to Glacier Watch notifications. You'll now receive alerts about glacial changes and potential risks in your region.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>You'll receive a welcome email confirming your subscription</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Real-time alerts will be sent based on your preferences</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>You can update your preferences anytime</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Emergency alerts will be sent immediately for critical situations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Bell className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Informed, Stay Safe</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Subscribe to receive real-time alerts about glacial changes, potential GLOF events, and emergency situations in your region.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.region ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.region}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.country ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="preferences.emailNotifications"
                  checked={formData.preferences.emailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email Notifications
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="preferences.smsNotifications"
                  checked={formData.preferences.smsNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="flex items-center text-sm font-medium text-gray-700">
                  <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                  SMS Notifications
                </label>
              </div>

              {errors.notifications && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.notifications}
                </p>
              )}
            </div>
          </div>

          {/* Risk Level Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Alerts</h3>
            <p className="text-sm text-gray-600 mb-4">Select which risk levels you want to be notified about:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskLevels.map(risk => (
                <div key={risk.value} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`risk-${risk.value}`}
                    checked={formData.preferences.riskLevels.includes(risk.value)}
                    onChange={() => handleRiskLevelChange(risk.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor={`risk-${risk.value}`} className="text-sm">
                    <div className="font-medium text-gray-700">{risk.label}</div>
                    <div className="text-gray-500">{risk.description}</div>
                  </label>
                </div>
              ))}
            </div>

            {errors.riskLevels && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.riskLevels}
              </p>
            )}
          </div>

          {/* Frequency Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Frequency</h3>
            <div className="space-y-3">
              {frequencies.map(freq => (
                <div key={freq.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={`freq-${freq.value}`}
                    name="preferences.frequency"
                    value={freq.value}
                    checked={formData.preferences.frequency === freq.value}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`freq-${freq.value}`} className="text-sm">
                    <div className="font-medium text-gray-700">{freq.label}</div>
                    <div className="text-gray-500">{freq.description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors duration-200`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Bell className="h-5 w-5 mr-2" />
                  Subscribe to Alerts
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-gray-500 text-center">
            By subscribing, you agree to receive notifications from Glacier Watch. 
            Your information will be used solely for sending alerts and will not be shared with third parties.
          </div>
        </form>
      </div>
    </section>
  );
};

export default NotificationForm;
