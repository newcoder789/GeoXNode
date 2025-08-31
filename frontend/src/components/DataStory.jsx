import React from 'react';
import { TrendingUp, Thermometer, Droplets, Mountain, AlertTriangle, Globe, Database, Satellite } from 'lucide-react';

const DataStory = () => {
  const facts = [
    {
      icon: Thermometer,
      title: 'Temperature Rise',
      value: '1.1°C',
      description: 'Global temperature increase since pre-industrial times',
      color: 'text-red-600'
    },
    {
      icon: Mountain,
      title: 'Glacier Loss',
      value: '267 Gt/year',
      description: 'Annual ice loss from glaciers worldwide',
      color: 'text-blue-600'
    },
    {
      icon: Droplets,
      title: 'Sea Level Rise',
      value: '3.4mm/year',
      description: 'Current rate of global sea level rise',
      color: 'text-cyan-600'
    },
    {
      icon: AlertTriangle,
      title: 'GLOF Events',
      value: '50+',
      description: 'Glacial Lake Outburst Floods in Himalayas since 1900',
      color: 'text-orange-600'
    }
  ];

  const methodology = [
    {
      icon: Satellite,
      title: 'Satellite Monitoring',
      description: 'Continuous observation using NASA Landsat, Sentinel, and other satellite systems for real-time glacier tracking.',
      features: ['Multi-spectral imaging', 'Change detection', 'Area calculation', 'Retreat measurement']
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Combining multiple data sources including weather stations, ground sensors, and historical records.',
      features: ['Weather data (IMD)', 'Climate models (GEE)', 'Historical databases', 'Real-time feeds']
    },
    {
      icon: TrendingUp,
      title: 'Risk Assessment',
      description: 'AI-powered analysis of multiple factors to determine GLOF risk levels and predict potential events.',
      features: ['Machine learning models', 'Pattern recognition', 'Risk scoring', 'Early warning systems']
    },
    {
      icon: Globe,
      title: 'Community Alerting',
      description: 'Multi-channel notification system to ensure communities receive timely warnings about potential risks.',
      features: ['SMS alerts', 'Email notifications', 'Mobile apps', 'Emergency broadcasts']
    }
  ];

  const impacts = [
    {
      title: 'Environmental Impact',
      description: 'Glacier retreat affects water availability, biodiversity, and ecosystem stability in the Himalayas.',
      details: [
        'Reduced water flow in rivers',
        'Changes in vegetation patterns',
        'Impact on wildlife habitats',
        'Alteration of local climate'
      ]
    },
    {
      title: 'Social Impact',
      description: 'Communities dependent on glacial water face water scarcity, food insecurity, and displacement.',
      details: [
        'Water scarcity for agriculture',
        'Reduced hydropower generation',
        'Increased migration patterns',
        'Cultural heritage at risk'
      ]
    },
    {
      title: 'Economic Impact',
      description: 'Glacial changes affect tourism, agriculture, and infrastructure, leading to significant economic losses.',
      details: [
        'Tourism industry disruption',
        'Agricultural productivity decline',
        'Infrastructure damage costs',
        'Insurance and recovery expenses'
      ]
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Science Behind Glacier Watch</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understanding the critical importance of glacier monitoring and how our technology helps protect communities 
          from the devastating effects of climate change in the Himalayas.
        </p>
      </div>

      {/* Key Facts */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Critical Climate Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4`}>
                  <Icon className={`h-8 w-8 ${fact.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{fact.title}</h4>
                <div className={`text-3xl font-bold ${fact.color} mb-2`}>{fact.value}</div>
                <p className="text-sm text-gray-600">{fact.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Methodology */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Monitoring Methodology</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {methodology.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h4>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <ul className="space-y-2">
                      {method.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Understanding the Impact</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{impact.title}</h4>
              <p className="text-gray-600 mb-4">{impact.description}</p>
              <ul className="space-y-2">
                {impact.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Matters */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Glacier Monitoring Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">For Communities</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Early warning systems save lives during GLOF events</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Time to evacuate and protect valuable assets</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Better planning for water resource management</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">For Science</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Understanding climate change patterns and trends</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Improving climate models and predictions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Supporting international climate research</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Mission</h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Help us protect communities and advance climate science by subscribing to alerts and staying informed about glacial changes in the Himalayas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Subscribe to Alerts
          </button>
          <button className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border border-blue-600 transition-colors duration-200">
            <Database className="w-5 h-5 mr-2" />
            View Data Sources
          </button>
        </div>
      </div>
    </section>
  );
};

export default DataStory;
