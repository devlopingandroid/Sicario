import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "analysisHistory"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    load();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">My History</h1>

      {history.length === 0 && <p className="text-gray-400">No history yet</p>}

      <div className="space-y-4">
        {history.map(h => (
          <div key={h.id} className="bg-forensic-charcoal-light p-4 rounded-lg border border-forensic-blue/30">
            <p><b>File:</b> {h.fileName}</p>
            <p><b>Result:</b> {h.result}</p>
            <p className="text-sm text-gray-400">
              {h.createdAt?.toDate().toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
