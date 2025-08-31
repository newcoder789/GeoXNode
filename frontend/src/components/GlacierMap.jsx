import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Mountain, AlertTriangle, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GlacierMap = () => {
  const [selectedGlacier, setSelectedGlacier] = useState(null);
  const [glacierData, setGlacierData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock glacier data with coordinates
  const mockGlaciers = React.useMemo(() => [
    {
      id: 'gangotri',
      name: 'Gangotri Glacier',
      region: 'Uttarakhand',
      country: 'India',
      coordinates: [30.0668, 78.9629],
      risk: 'HIGH',
      area: 286,
      retreat: 23,
      temperature: -2.5,
      snowCover: 85,
      description: 'One of the largest glaciers in the Himalayas, showing significant retreat patterns.'
    },
    {
      id: 'siachen',
      name: 'Siachen Glacier',
      region: 'Ladakh',
      country: 'India',
      coordinates: [35.4212, 77.1090],
      risk: 'MEDIUM',
      area: 76,
      retreat: 15,
      temperature: -8.2,
      snowCover: 92,
      description: 'World\'s highest battlefield glacier, experiencing moderate retreat due to climate change.'
    },
    {
      id: 'baltoro',
      name: 'Baltoro Glacier',
      region: 'Kashmir',
      country: 'Pakistan',
      coordinates: [35.7392, 76.2401],
      risk: 'CRITICAL',
      area: 62,
      retreat: 35,
      temperature: -5.8,
      snowCover: 78,
      description: 'Critical glacier showing rapid retreat and high risk of GLOF events.'
    },
    {
      id: 'chhota',
      name: 'Chhota Shigri',
      region: 'Himachal Pradesh',
      country: 'India',
      coordinates: [32.2432, 77.1892],
      risk: 'LOW',
      area: 15,
      retreat: 8,
      temperature: -1.2,
      snowCover: 95,
      description: 'Smaller glacier with stable conditions and low risk assessment.'
    },
    {
      id: 'khumbu',
      name: 'Khumbu Glacier',
      region: 'Nepal',
      country: 'Nepal',
      coordinates: [28.0026, 86.8528],
      risk: 'HIGH',
      area: 12,
      retreat: 28,
      temperature: -3.1,
      snowCover: 82,
      description: 'Glacier near Mount Everest, experiencing significant retreat and ice loss.'
    }
  ], []);

  const riskColors = {
    LOW: '#10B981',
    MEDIUM: '#F59E0B',
    HIGH: '#EF4444',
    CRITICAL: '#7C2D12'
  };

  const riskRadius = {
    LOW: 5000,
    MEDIUM: 8000,
    HIGH: 12000,
    CRITICAL: 15000
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGlacierData(mockGlaciers);
      setLoading(false);
    }, 1000);
  }, [mockGlaciers]);

  const handleGlacierClick = (glacier) => {
    setSelectedGlacier(glacier);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Himalayan Glacier Map</h2>
        <p className="text-gray-600">Interactive map showing glacier locations, risk levels, and real-time monitoring data</p>
      </div>

      {/* Map controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Risk Levels:</span>
          {Object.entries(riskColors).map(([risk, color]) => (
            <div key={risk} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm text-gray-600">{risk}</span>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-500">
          {glacierData.length} glaciers monitored • Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Map container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <MapContainer
          center={[30.0668, 78.9629]}
          zoom={6}
          style={{ height: '600px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Glacier markers */}
          {glacierData.map((glacier) => (
            <div key={glacier.id}>
              {/* Risk zone circle */}
              <Circle
                center={glacier.coordinates}
                radius={riskRadius[glacier.risk]}
                pathOptions={{
                  color: riskColors[glacier.risk],
                  fillColor: riskColors[glacier.risk],
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
              
              {/* Glacier marker */}
              <Marker
                position={glacier.coordinates}
                eventHandlers={{
                  click: () => handleGlacierClick(glacier)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{glacier.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Region:</strong> {glacier.region}, {glacier.country}</p>
                      <p><strong>Risk Level:</strong> 
                        <span 
                          className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{ 
                            backgroundColor: `${riskColors[glacier.risk]}20`,
                            color: riskColors[glacier.risk]
                          }}
                        >
                          {glacier.risk}
                        </span>
                      </p>
                      <p><strong>Area:</strong> {glacier.area} km²</p>
                      <p><strong>Retreat:</strong> {glacier.retreat} m/year</p>
                      <p><strong>Temperature:</strong> {glacier.temperature}°C</p>
                      <p><strong>Snow Cover:</strong> {glacier.snowCover}%</p>
                    </div>
                    <p className="text-gray-600 text-xs mt-2">{glacier.description}</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>

      {/* Selected glacier details */}
      {selectedGlacier && (
        <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedGlacier.name}</h3>
              <p className="text-gray-600">{selectedGlacier.region}, {selectedGlacier.country}</p>
            </div>
            <span 
              className="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
              style={{ 
                backgroundColor: `${riskColors[selectedGlacier.risk]}20`,
                color: riskColors[selectedGlacier.risk]
              }}
            >
              {selectedGlacier.risk} RISK
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedGlacier.area}</div>
              <div className="text-sm text-gray-600">Area (km²)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{selectedGlacier.retreat}</div>
              <div className="text-sm text-gray-600">Retreat (m/year)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedGlacier.temperature}°C</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{selectedGlacier.snowCover}%</div>
              <div className="text-sm text-gray-600">Snow Cover</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Description
            </h4>
            <p className="text-gray-700">{selectedGlacier.description}</p>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Risk Zones</h4>
            <div className="space-y-2">
              {Object.entries(riskColors).map(([risk, color]) => (
                <div key={risk} className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300" 
                    style={{ backgroundColor: `${color}20` }}
                  ></div>
                  <span className="text-sm text-gray-600">{risk} Risk</span>
                  <span className="text-xs text-gray-500">
                    ({riskRadius[risk] / 1000}km radius)
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Data Sources</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4 text-blue-600" />
                <span>Satellite imagery (NASA, ESA)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Ground monitoring stations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-green-600" />
                <span>Climate data (IMD, GEE)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlacierMap;
