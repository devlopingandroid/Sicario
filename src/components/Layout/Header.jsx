import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";


const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  await signOut(auth);
  navigate("/login");
};


  return (
    <header className="h-16 bg-forensic-charcoal-light border-b border-forensic-blue/30 flex items-center justify-between px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-white">Document Analysis Dashboard</h1>
        <p className="text-sm text-gray-400">Real-time forensic document verification</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Settings */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>

        <div className="h-8 w-px bg-forensic-blue/30 mx-2" />

        {/* Profile + Logout */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-forensic-blue/10 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-forensic-blue to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>

          <div className="text-left mr-2">
            <p className="text-sm font-medium text-white">Forensic Analyst</p>
            <p className="text-xs text-gray-400">admin@sicarioai.com</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
