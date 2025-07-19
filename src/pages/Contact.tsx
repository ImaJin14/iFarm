import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Facebook, Instagram, Twitter, CheckCircle } from 'lucide-react';
import { useContactContent } from '../hooks/useContactContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const { contactContent, loading, error } = useContactContent();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  // Pre-fill form from URL parameters
  useEffect(() => {
    const subject = searchParams.get('subject');
    const message = searchParams.get('message');
    const inquiryType = searchParams.get('inquiryType');

    if (subject || message || inquiryType) {
      setFormData(prev => ({
        ...prev,
        subject: subject || prev.subject,
        message: message || prev.message,
        inquiryType: inquiryType || prev.inquiryType
      }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      setShowSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock
    };
    return icons[iconName] || MapPin;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !contactContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error || 'Failed to load contact content'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {contactContent.hero_title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contactContent.hero_description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-lg text-gray-600 mb-8">
                {contactContent.contact_description}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visit Our Farm</h3>
                  <p className="text-gray-600">{contactContent.address.split(',').map((line, index) => (
                    <span key={index}>
                      {line.trim()}
                      {index < contactContent.address.split(',').length - 1 && <br />}
                    </span>
                  ))}</p>
                  <p className="text-sm text-gray-500 mt-1">Farm visits by appointment only</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600">{contactContent.phone}</p>
                  <p className="text-sm text-gray-500 mt-1">Monday - Friday, 8 AM - 6 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">{contactContent.email}</p>
                  <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                  <div className="text-gray-600">
                    {(contactContent.business_hours as any[])?.map((hour, index) => (
                      <p key={index}>{hour.day}: {hour.hours}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {(contactContent.social_links as any[])?.map((link, index) => {
                  const IconComponent = getIconComponent(link.icon);
                  const getColorClass = (platform: string) => {
                    switch (platform.toLowerCase()) {
                      case 'facebook': return 'bg-blue-600 hover:bg-blue-700';
                      case 'instagram': return 'bg-pink-600 hover:bg-pink-700';
                      case 'twitter': return 'bg-blue-400 hover:bg-blue-500';
                      case 'linkedin': return 'bg-blue-700 hover:bg-blue-800';
                      case 'youtube': return 'bg-red-600 hover:bg-red-700';
                      default: return 'bg-gray-600 hover:bg-gray-700';
                    }
                  };
                  
                  return (
                    <a 
                      key={index}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${getColorClass(link.platform)} text-white p-3 rounded-lg transition-colors duration-200`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="purchase">Purchase Inquiry</option>
                    <option value="breeding">Breeding Services</option>
                    <option value="consultation">Consultation</option>
                    <option value="visit">Farm Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center group"
              >
                <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">
              {contactContent.map_description}
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map would be integrated here</p>
              <p className="text-sm text-gray-500 mt-2">{contactContent.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{contactContent.newsletter_title}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {contactContent.newsletter_description}
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg sm:rounded-r-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium transition-colors duration-200 mt-3 sm:mt-0">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            {contactContent.newsletter_privacy_text}
          </p>
        </div>
      </section>
    </div>
  );
}