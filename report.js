import { db, storage } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const flyerForm = document.getElementById("flyerForm");
const status = document.getElementById("status");

flyerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ownerName = document.getElementById("ownerName").value;
  const dogName = document.getElementById("dogName").value;
  const dogBreed = document.getElementById("dogBreed").value;
  const dogColor = document.getElementById("dogColor").value;
  const lastPlace = document.getElementById("lastPlace").value;
  const email = document.getElementById("email").value;
  const phoNum = document.getElementById("phoNum").value;
  const dogPic = document.getElementById("dogPic").files[0];

  if (!file) {
    status.textContent = "Please select a pet image.";
    return;
  }

  try {
    // 1️⃣ Upload flyer to Firebase Storage
    const fileRef = ref(storage, `flyers/${file.name}-${Date.now()}`);
    await uploadBytes(fileRef, file);
    const flyerURL = await getDownloadURL(fileRef);

    // 2️⃣ Add info to Firestore
    await addDoc(collection(flyerdb, "flyers"), {
      ownerName,
      dogName,
      dogBreed,
      dogColor,
      lastPlace,
      email,
      phoNum,
      flyerURL,
      createdAt: serverTimestamp(),
    });

    status.textContent = "✅ Flyer submitted successfully!";
    flyerForm.reset();
  } catch (error) {
    console.error("Error uploading flyer:", error);
    status.textContent = "❌ Failed to submit flyer. Try again.";
  }
});
