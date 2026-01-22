import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveAnalysisHistory = async ({ jobId, fileName, result }) => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user logged in, history not saved");
    return;
  }

  try {
    await addDoc(collection(db, "analysisHistory"), {
      uid: user.uid,
      jobId,
      fileName,
      result,
      createdAt: serverTimestamp()
    });

    console.log("History saved successfully");
  } catch (err) {
    console.error("History save failed:", err);
  }
};
