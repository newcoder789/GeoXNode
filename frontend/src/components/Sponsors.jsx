import React from 'react';
import { Award, Globe, Shield, Zap, Users, Heart } from 'lucide-react';

const Sponsors = () => {
  const sponsors = [
    {
      name: 'OpenXAI',
      logo: '🔬',
      description: 'AI Infrastructure & Model Deployment',
      tier: 'PLATINUM',
      contribution: 'AI Model Hosting & Compute Resources',
      website: 'https://openxai.com'
    },
    {
      name: 'HackNode',
      logo: '🚀',
      description: 'Hackathon Platform & Community',
      tier: 'GOLD',
      contribution: 'Event Organization & Mentorship',
      website: 'https://hacknode.dev'
    },
    {
      name: 'ClimateTech Initiative',
      logo: '🌱',
      description: 'Environmental Technology Accelerator',
      tier: 'SILVER',
      contribution: 'Domain Expertise & Validation',
      website: '#'
    }
  ];

  const partners = [
    {
      name: 'NASA Earthdata',
      logo: '🛰️',
      description: 'Satellite Data & Climate Research',
      type: 'DATA_PARTNER'
    },
    {
      name: 'Google Earth Engine',
      logo: '🌍',
      description: 'Geospatial Analysis Platform',
      type: 'TECH_PARTNER'
    },
    {
      name: 'IMD India',
      logo: '🌤️',
      description: 'Weather Data & Forecasting',
      type: 'GOVERNMENT_PARTNER'
    },
    {
      name: 'ESA Sentinel',
      logo: '🛰️',
      description: 'European Space Agency Satellite Data',
      type: 'DATA_PARTNER'
    }
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-600 to-purple-800';
      case 'GOLD': return 'from-yellow-500 to-yellow-600';
      case 'SILVER': return 'from-gray-400 to-gray-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getPartnerTypeColor = (type) => {
    switch (type) {
      case 'DATA_PARTNER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TECH_PARTNER': return 'bg-green-100 text-green-800 border-green-200';
      case 'GOVERNMENT_PARTNER': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Sponsors & Partners</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This project is made possible through the generous support of our sponsors and the collaboration of our data partners.
        </p>
      </div>

      {/* Sponsors */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Project Sponsors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Sponsor Logo & Tier */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{sponsor.logo}</div>
                <div className={`inline-flex px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${getTierColor(sponsor.tier)}`}>
                  {sponsor.tier}
                </div>
              </div>

              {/* Sponsor Info */}
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{sponsor.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{sponsor.description}</p>
                <p className="text-blue-600 text-sm font-medium">{sponsor.contribution}</p>
              </div>

              {/* Sponsor Link */}
              <div className="text-center">
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  Visit Website
                  <Globe className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Data & Technology Partners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-3xl mb-3">{partner.logo}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{partner.name}</h4>
              <p className="text-gray-600 text-sm mb-3">{partner.description}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPartnerTypeColor(partner.type)}`}>
                {partner.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Our Mission</h3>
          <p className="text-gray-600 mb-6">
            Help us expand our monitoring network and develop advanced AI models for better glacier monitoring and early warning systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Become a Partner
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              Contribute Data
            </button>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
          <div className="text-gray-600">Glaciers Monitored</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Globe className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
          <div className="text-gray-600">Countries Covered</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
          <div className="text-gray-600">Real-time Monitoring</div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
