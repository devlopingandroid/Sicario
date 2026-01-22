import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveAnalysisHistory = async ({ jobId, fileName, result, type }) => {
  const user = auth.currentUser;

  if (!user) {
    console.log("No user logged in, strictly skipping history save");
    return;
  }

  try {
    await addDoc(collection(db, "analysisHistory"), {
      uid: user.uid,
      jobId,
      fileName,
      result,
      type: type || "General",
      createdAt: serverTimestamp()
    });

    console.log("History saved successfully to Firestore");
  } catch (err) {
    console.error("History save failed:", err);
  }
};
