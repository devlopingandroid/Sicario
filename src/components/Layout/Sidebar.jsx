import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Layers, FileText, Shield } from 'lucide-react';
import { cn } from "../../lib/utils";
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/batch', icon: Layers, label: 'Batch Processing' },
  ];

  return (
    <aside className="w-64 h-screen bg-forensic-charcoal border-r border-forensic-blue/30 flex flex-col overflow-hidden shrink-0">

      {/* Logo */}
      <div className="p-6 border-b border-forensic-blue/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-forensic-blue to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Sicario</span>
            <p className="text-xs text-gray-400">Document Analyzer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-forensic-blue text-white shadow-lg shadow-forensic-blue/20'
                    : 'text-gray-400 hover:bg-forensic-blue/10 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="flex-grow" />

      {/* Help box */}
      <div className="p-4 border-t border-forensic-blue/30">
        <div className="bg-forensic-blue/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Need Help?</span>
          </div>
          <p className="text-xs text-gray-400">
            View documentation for detailed analysis guides
          </p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
