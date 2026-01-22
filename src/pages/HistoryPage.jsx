import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Helmet } from "react-helmet";
import { FileText, Calendar, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "analysisHistory"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Pass' || status === 'COMPLETED') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Fail') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'Warn') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'Pass' || status === 'COMPLETED') return <CheckCircle className="w-4 h-4 ml-1" />;
    if (status === 'Fail') return <AlertTriangle className="w-4 h-4 ml-1" />;
    return <Clock className="w-4 h-4 ml-1" />;
  };

  return (
    <>
      <Helmet>
        <title>Analysis History - Sicario</title>
      </Helmet>

      <div className="min-h-full p-8 bg-white text-black">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              Analysis History
            </h1>
            <p className="text-gray-500 mt-2">Track all your past document verification requests</p>
          </motion.div>

          {loading ? (
            <p className="text-gray-500">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">No History Found</h3>
              <p className="text-gray-400">You haven't analyzed any documents yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((h, index) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{h.fileName}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> {h.type ? h.type.toUpperCase() : "DOC"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {h.createdAt?.toDate().toLocaleDateString()} {h.createdAt?.toDate().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center ${getStatusColor(h.result)}`}>
                    {h.result} {getStatusIcon(h.result)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
