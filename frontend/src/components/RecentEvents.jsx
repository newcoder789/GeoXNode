import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, TrendingUp, CheckCircle, XCircle, Eye } from 'lucide-react';

const RecentEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock events data
  const mockEvents = React.useMemo(() => [
    {
      id: '1',
      title: 'Gangotri Glacier Rapid Retreat Detected',
      description: 'Satellite imagery shows accelerated retreat of 23m/year, exceeding historical averages by 40%.',
      type: 'GLACIER_RETREAT',
      severity: 'HIGH',
      status: 'ACTIVE',
      location: {
        region: 'Uttarakhand',
        country: 'India',
        coordinates: [30.0668, 78.9629]
      },
      details: {
        startTime: new Date('2024-01-15T10:30:00Z'),
        affectedArea: 15.2,
        source: 'NASA Landsat 9',
        verified: true
      },
      metadata: {
        tags: ['retreat', 'climate change', 'satellite'],
        images: ['gangotri_retreat_2024.jpg'],
        externalLinks: ['https://nasa.gov/landsat']
      }
    },
    {
      id: '2',
      title: 'Potential GLOF Risk at Baltoro Glacier',
      description: 'Formation of new glacial lake detected with unstable moraine dam. High risk of outburst flood.',
      type: 'LAKE_FORMATION',
      severity: 'CRITICAL',
      status: 'MONITORING',
      location: {
        region: 'Kashmir',
        country: 'Pakistan',
        coordinates: [35.7392, 76.2401]
      },
      details: {
        startTime: new Date('2024-01-12T14:15:00Z'),
        affectedArea: 8.5,
        source: 'ESA Sentinel-2',
        verified: true
      },
      metadata: {
        tags: ['GLOF', 'lake formation', 'emergency'],
        images: ['baltoro_lake_2024.jpg'],
        externalLinks: ['https://esa.int/sentinel']
      }
    },
    {
      id: '3',
      title: 'Heavy Snowfall Affects Siachen Monitoring',
      description: 'Unprecedented snowfall of 3.2m in 24 hours affecting ground monitoring stations and satellite visibility.',
      type: 'WEATHER_ALERT',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      location: {
        region: 'Ladakh',
        country: 'India',
        coordinates: [35.4212, 77.1090]
      },
      details: {
        startTime: new Date('2024-01-10T08:00:00Z'),
        endTime: new Date('2024-01-11T16:00:00Z'),
        source: 'IMD Weather Station',
        verified: true
      },
      metadata: {
        tags: ['weather', 'snowfall', 'monitoring'],
        images: ['siachen_snow_2024.jpg'],
        externalLinks: ['https://mausam.imd.gov.in']
      }
    },
    {
      id: '4',
      title: 'Avalanche Risk Increased in Khumbu Region',
      description: 'Temperature fluctuations and reduced snow stability increase avalanche risk for mountaineering activities.',
      type: 'AVALANCHE',
      severity: 'HIGH',
      status: 'ACTIVE',
      location: {
        region: 'Nepal',
        country: 'Nepal',
        coordinates: [28.0026, 86.8528]
      },
      details: {
        startTime: new Date('2024-01-08T12:00:00Z'),
        source: 'Ground Sensors + Satellite Data',
        verified: true
      },
      metadata: {
        tags: ['avalanche', 'mountaineering', 'safety'],
        images: ['khumbu_avalanche_risk.jpg'],
        externalLinks: ['https://nepal.gov.np']
      }
    },
    {
      id: '5',
      title: 'Chhota Shigri Glacier Stability Confirmed',
      description: 'Annual assessment shows stable conditions with minimal retreat of 8m/year, within normal parameters.',
      type: 'GLACIER_RETREAT',
      severity: 'LOW',
      status: 'RESOLVED',
      location: {
        region: 'Himachal Pradesh',
        country: 'India',
        coordinates: [32.2432, 77.1892]
      },
      details: {
        startTime: new Date('2024-01-05T09:00:00Z'),
        endTime: new Date('2024-01-06T17:00:00Z'),
        source: 'Ground Survey + Satellite',
        verified: true
      },
      metadata: {
        tags: ['stability', 'annual assessment', 'low risk'],
        images: ['chhota_shigri_2024.jpg'],
        externalLinks: ['https://himachal.gov.in']
      }
    }
  ], []);

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'FLOOD', label: 'Floods' },
    { value: 'AVALANCHE', label: 'Avalanches' },
    { value: 'GLACIER_RETREAT', label: 'Glacier Retreat' },
    { value: 'LAKE_FORMATION', label: 'Lake Formation' },
    { value: 'WEATHER_ALERT', label: 'Weather Alerts' },
    { value: 'SYSTEM_ALERT', label: 'System Alerts' }
  ];

  const severityLevels = [
    { value: 'all', label: 'All Severities' },
    { value: 'LOW', label: 'Low', color: 'text-green-600' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
    { value: 'HIGH', label: 'High', color: 'text-red-600' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-800' }
  ];

  const severityColors = {
    LOW: 'bg-green-100 text-green-800 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HIGH: 'bg-red-100 text-red-800 border-red-200',
    CRITICAL: 'bg-red-900 text-white border-red-700'
  };

  const typeColors = {
    FLOOD: 'bg-blue-100 text-blue-800',
    AVALANCHE: 'bg-orange-100 text-orange-800',
    GLACIER_RETREAT: 'bg-purple-100 text-purple-800',
    LAKE_FORMATION: 'bg-cyan-100 text-cyan-800',
    WEATHER_ALERT: 'bg-gray-100 text-gray-800',
    SYSTEM_ALERT: 'bg-indigo-100 text-indigo-800'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, [mockEvents]);

  const filteredEvents = events.filter(event => {
    const typeMatch = filterType === 'all' || event.type === filterType;
    const severityMatch = filterSeverity === 'all' || event.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Events & Alerts</h2>
        <p className="text-gray-600">Stay updated with the latest glacier-related events, alerts, and monitoring updates</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Severity Level
          </label>
          <select
            id="severity-filter"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {severityLevels.map(severity => (
              <option key={severity.value} value={severity.value}>{severity.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <span className="text-sm text-gray-500">
            {filteredEvents.length} of {events.length} events
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[event.severity]}`}>
                    {event.severity}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[event.type]}`}>
                    {event.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.status === 'ACTIVE' ? 'bg-red-100 text-red-800' : 
                    event.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3">{event.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.details.startTime.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location.region}, {event.location.country}
                  </div>
                  {event.details.affectedArea && (
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {event.details.affectedArea} km² affected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                <button
                  onClick={closeEventDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status and Type */}
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${severityColors[selectedEvent.severity]}`}>
                    {selectedEvent.severity} RISK
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${typeColors[selectedEvent.type]}`}>
                    {selectedEvent.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedEvent.status === 'ACTIVE' ? 'bg-red-100 text-red-800' : 
                    selectedEvent.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>

                {/* Location */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location.region}, {selectedEvent.location.country}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Coordinates: {selectedEvent.location.coordinates[0]}, {selectedEvent.location.coordinates[1]}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Start Time:</span>
                      <div className="text-gray-600">{selectedEvent.details.startTime.toLocaleString()}</div>
                    </div>
                    {selectedEvent.details.endTime && (
                      <div>
                        <span className="font-medium text-gray-700">End Time:</span>
                        <div className="text-gray-600">{selectedEvent.details.endTime.toLocaleString()}</div>
                      </div>
                    )}
                    {selectedEvent.details.affectedArea && (
                      <div>
                        <span className="font-medium text-gray-700">Affected Area:</span>
                        <div className="text-gray-600">{selectedEvent.details.affectedArea} km²</div>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Source:</span>
                      <div className="text-gray-600">{selectedEvent.details.source}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Verified:</span>
                      <div className="flex items-center">
                        {selectedEvent.details.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={selectedEvent.details.verified ? 'text-green-600' : 'text-red-600'}>
                          {selectedEvent.details.verified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedEvent.metadata.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.metadata.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {selectedEvent.metadata.externalLinks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">External Links</h4>
                    <div className="space-y-2">
                      {selectedEvent.metadata.externalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeEventDetails}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200">
                  Subscribe to Similar Events
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentEvents;
