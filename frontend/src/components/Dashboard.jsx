import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Mountain, AlertTriangle, Thermometer, Droplets, Snowflake, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const [selectedGlacier, setSelectedGlacier] = useState('all');
  const [glacierData, setGlacierData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockGlaciers = React.useMemo(() => [
    { id: 'gangotri', name: 'Gangotri Glacier', region: 'Uttarakhand', risk: 'HIGH', area: 286, retreat: 23, temperature: -2.5, snowCover: 85 },
    { id: 'siachen', name: 'Siachen Glacier', region: 'Ladakh', risk: 'MEDIUM', area: 76, retreat: 15, temperature: -8.2, snowCover: 92 },
    { id: 'baltoro', name: 'Baltoro Glacier', region: 'Kashmir', risk: 'CRITICAL', area: 62, retreat: 35, temperature: -5.8, snowCover: 78 },
    { id: 'chhota', name: 'Chhota Shigri', region: 'Himachal', risk: 'LOW', area: 15, retreat: 8, temperature: -1.2, snowCover: 95 },
  ], []);

  const riskColors = {
    
    LOW: '#10B981',
    MEDIUM: '#F59E0B',
    HIGH: '#EF4444',
    CRITICAL: '#7C2D12'
  };

  const riskData = [
    { name: 'Low Risk', value: 1, color: '#10B981' },
    { name: 'Medium Risk', value: 1, color: '#F59E0B' },
    { name: 'High Risk', value: 1, color: '#EF4444' },
    { name: 'Critical Risk', value: 1, color: '#7C2D12' }
  ];

  const temperatureData = [
    { month: 'Jan', current: -8.2, historical: -7.5 },
    { month: 'Feb', current: -7.8, historical: -7.2 },
    { month: 'Mar', current: -5.4, historical: -5.1 },
    { month: 'Apr', current: -2.1, historical: -1.8 },
    { month: 'May', current: 1.2, historical: 1.5 },
    { month: 'Jun', current: 3.8, historical: 4.1 },
    { month: 'Jul', current: 5.2, historical: 5.5 },
    { month: 'Aug', current: 4.9, historical: 5.2 },
    { month: 'Sep', current: 2.1, historical: 2.4 },
    { month: 'Oct', current: -1.8, historical: -1.5 },
    { month: 'Nov', current: -4.2, historical: -3.9 },
    { month: 'Dec', current: -6.8, historical: -6.5 }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGlacierData(mockGlaciers);
      setLoading(false);
    }, 1000);
  }, [mockGlaciers]);

  const filteredGlaciers = selectedGlacier === 'all' 
    ? glacierData 
    : glacierData.filter(g => g.id === selectedGlacier);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Glacier Monitoring Dashboard</h2>
        <p className="text-gray-600">Real-time data and risk assessment for Himalayan glaciers</p>
      </div>

      {/* Glacier selector */}
      <div className="mb-8">
        <label htmlFor="glacier-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Glacier
        </label>
        <select
          id="glacier-select"
          value={selectedGlacier}
          onChange={(e) => setSelectedGlacier(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Glaciers</option>
          {glacierData.map(glacier => (
            <option key={glacier.id} value={glacier.id}>{glacier.name}</option>
          ))}
        </select>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mountain className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Glaciers</p>
              <p className="text-2xl font-bold text-gray-900">{glacierData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {glacierData.filter(g => g.risk === 'HIGH' || g.risk === 'CRITICAL').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Temperature</p>
              <p className="text-2xl font-bold text-gray-900">
                {glacierData.reduce((sum, g) => sum + g.temperature, 0) / glacierData.length}°C
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Snowflake className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Snow Cover</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(glacierData.reduce((sum, g) => sum + g.snowCover, 0) / glacierData.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Risk distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature trends */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2} name="Current Year" />
              <Line type="monotone" dataKey="historical" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Historical Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Glacier details table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Glacier Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glacier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (km²)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retreat (m/year)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snow Cover (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGlaciers.map((glacier) => (
                <tr key={glacier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{glacier.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{glacier.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      style={{ 
                        backgroundColor: `${riskColors[glacier.risk]}20`,
                        color: riskColors[glacier.risk]
                      }}
                    >
                      {glacier.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{glacier.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {glacier.retreat > 20 ? (
                        <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                      )}
                      {glacier.retreat}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{glacier.temperature}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{glacier.snowCover}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
