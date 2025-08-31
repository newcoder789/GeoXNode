import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-sm border border-blue-600/30 rounded-full px-4 py-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>HackNode Hackathon Project</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Protecting Communities from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Glacial Disasters
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
              Real-time monitoring of Himalayan glaciers to detect and warn about Glacial Lake Outburst Floods (GLOFs), 
              protecting millions of lives and infrastructure in vulnerable regions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Live Dashboard
              </Link>
              <Link
                to="/subscribe"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <Shield className="w-5 h-5 mr-2" />
                Get Alerts
              </Link>
            </div>
          </div>
          
          {/* Right content - Stats and features */}
          <div className="space-y-6">
            {/* Key statistics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400">2.5M+</div>
                <div className="text-blue-100 text-sm">People at Risk</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400">24/7</div>
                <div className="text-blue-100 text-sm">Monitoring</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-400">15+</div>
                <div className="text-blue-100 text-sm">Critical Glaciers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400">5min</div>
                <div className="text-blue-100 text-sm">Alert Time</div>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-blue-100">Real-time satellite monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-blue-100">Instant SMS & email alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-blue-100">AI-powered risk assessment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
