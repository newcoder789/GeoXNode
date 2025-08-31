import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Twitter, Linkedin, Heart, Shield, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Glacier Map', href: '/map' },
    { name: 'Recent Events', href: '/events' },
    { name: 'Subscribe to Alerts', href: '/subscribe' },
    { name: 'Data & Research', href: '/data' },
    { name: 'About Project', href: '/about' }
  ];

  const resources = [
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Data Sources', href: '/data-sources' },
    { name: 'Research Papers', href: '/research' },
    { name: 'Glossary', href: '/glossary' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Support', href: '/support' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/glacier-watch', color: 'hover:text-gray-900' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/glacierwatch', color: 'hover:text-blue-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/glacier-watch', color: 'hover:text-blue-700' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-bold">Glacier Watch</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A comprehensive platform for monitoring Himalayan glaciers and providing early warning systems for Glacial Lake Outburst Floods (GLOFs).
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-400 mb-1">Email</h5>
                <p className="text-gray-300 text-sm">info@glacierwatch.org</p>
                <p className="text-gray-300 text-sm">alerts@glacierwatch.org</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-400 mb-1">Emergency</h5>
                <p className="text-gray-300 text-sm">+91-XXX-XXX-XXXX</p>
                <p className="text-gray-300 text-sm">24/7 Hotline</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-400 mb-1">Headquarters</h5>
                <p className="text-gray-300 text-sm">Himalayan Research Institute</p>
                <p className="text-gray-300 text-sm">Dehradun, Uttarakhand, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h5 className="text-sm font-medium text-blue-400 mb-3">Built With</h5>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">React</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Node.js</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">MongoDB</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Tailwind CSS</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Python AI</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Blockchain Ready</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} Glacier Watch. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built for HackNode Hackathon</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              <Heart className="w-4 h-4 inline text-red-500 mr-1" />
              Protecting communities through advanced glacier monitoring and early warning systems.
              <Zap className="w-4 h-4 inline text-yellow-500 ml-1" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
