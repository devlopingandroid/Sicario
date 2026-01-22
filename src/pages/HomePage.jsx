import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, BarChart3, FileText, ArrowRight, Zap, Lock, Globe } from 'lucide-react';
import { Button } from "../components/ui/button";
import { motion } from 'framer-motion';

import processImg from "../assets/process.png"; // ✅ NEW

const HomePage = () => {

  const features = [
    { icon: Shield, title: 'Advanced Forgery Detection', description: 'Deep learning CNN models detect document tampering with 95%+ accuracy' },
    { icon: Zap, title: 'Real-time Processing', description: 'Live WebSocket updates show analysis progress in real-time' },
    { icon: BarChart3, title: 'Comprehensive Analysis', description: 'OCR, ELA, Benford\'s Law, and heatmap visualization in one platform' },
    { icon: Lock, title: 'Secure & Private', description: 'End-to-end encryption ensures your documents remain confidential' },
    { icon: FileText, title: 'Detailed Reports', description: 'Generate professional PDF reports with evidence and confidence scores' },
    { icon: Globe, title: 'Batch Processing', description: 'Analyze multiple documents simultaneously with queue management' }
  ];

  return (
    <>
      <Helmet>
        <title>Sicario - Advanced Document Forensic Analysis</title>
      </Helmet>

      <div className="min-h-full bg-white text-black">

        {/* HERO SECTION */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-8 py-24 text-center">

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
              Detect document forgery and tampering using AI, OCR, ELA and statistical techniques
            </p>

            <div className="flex justify-center gap-4 mb-16">
              <Link to="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg">
                View Demo
              </Button>
            </div>

            {/* ✅ SINGLE PROCESS IMAGE */}
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
        <section className="max-w-7xl mx-auto px-8 py-24">
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

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Analyze Your Documents?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start detecting forgery with our AI platform
            </p>
            <Link to="/upload">
              <Button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
