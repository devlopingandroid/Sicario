import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, BarChart3, FileText, ArrowRight, Zap, Lock, Globe, FileCheck, Landmark, Receipt } from 'lucide-react';
import { Button } from "../components/ui/button";
import { motion } from 'framer-motion';

import processImg from "../assets/process.png";

const HomePage = () => {

  const features = [
    { icon: Shield, title: 'Advanced Forgery Detection', description: 'Deep learning CNN models detect document tampering with 95%+ accuracy' },
    { icon: Zap, title: 'Real-time Processing', description: 'Live WebSocket updates show analysis progress in real-time' },
    { icon: BarChart3, title: 'Comprehensive Analysis', description: 'OCR, ELA, Benford\'s Law, and heatmap visualization in one platform' },
    { icon: Lock, title: 'Secure & Private', description: 'End-to-end encryption ensures your documents remain confidential' },
    { icon: FileText, title: 'Detailed Reports', description: 'Generate professional PDF reports with evidence and confidence scores' },
    { icon: Globe, title: 'Batch Processing', description: 'Analyze multiple documents simultaneously with queue management' }
  ];

  const analysisOptions = [
    {
      title: "Aadhaar OCR Verification",
      icon: FileCheck,
      desc: "Verify identity cards and detect morphed Aadhaar images.",
      link: "/upload/aadhaar",
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Marksheets Verification",
      icon: Landmark,
      desc: "Detect tampering in academic marks and certificates.",
      link: "/upload/marksheet",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Fake Bills Verification",
      icon: Receipt,
      desc: "Analyze invoices and receipts for digital manipulation.",
      link: "/upload/bills",
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sicario - Advanced Document Forensic Analysis</title>
      </Helmet>

      <div className="min-h-full bg-white text-black">

        {/* HERO SECTION */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-8 py-20 text-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6"
            >
              Advanced Document <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
                Forensic Analysis
              </span>
            </motion.h1>

            <p className="text-xl text-gray-700 mb-12">
              Select the type of document you want to verify
            </p>

            {/* ANALYSIS OPTIONS GRID */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {analysisOptions.map((option, idx) => (
                <Link to={option.link} key={idx}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="border rounded-2xl p-8 h-full bg-white shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${option.color}`}>
                      <option.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{option.title}</h3>
                    <p className="text-gray-600 mb-6">{option.desc}</p>
                    <div className="flex items-center font-semibold text-blue-700">
                      Start Verification <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* PROCESS IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <img
                src={processImg}
                alt="Forensic Process"
                className="max-w-5xl w-full rounded-2xl shadow-xl border border-gray-200"
              />
            </motion.div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-8 py-24 bg-gray-50 rounded-3xl mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Features for Forensic Experts
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
