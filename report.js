// report.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 5500;

// Firebase Admin SDK
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint for flyer submission
app.post('/foundform', async (req, res) => {
  try {

 
    console.log('=== RECEIVED DATA ===');
    console.log('Full req.body:', req.body);
    console.log('metroArea:', req.body.metroArea);
    console.log('comments:', req.body.comments);
    console.log('dogSize:', req.body.dogSize);
    console.log('====================');

    const { bystandName, dogName, dogBreed, dogColor, dogSize, cityName, metroArea, lastPlace, email, phoNum, dogPic, comments } = req.body;

    console.log('After destructuring - metroArea:', metroArea);
    console.log('After destructuring - comments:', comments);
    console.log('After destructuring - dogSize:', dogSize);

    // Add flyer to Firestore
    const cleanName = bystandName.replace(/\s+/g, '_');
     const docId = `${cleanName}_${Date.now()}`;
    
    
    await db.collection('flyers').doc(docId).set({
      bystandName,
      dogName,
      dogBreed,
      dogColor,
      dogSize,
      cityName,
      metroArea,
      lastPlace,
      email,
      phoNum,
      dogPic,
      comments,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('New flyer submitted:', docId );
    console.log(cityName);
    res.json({ message: 'Flyer submitted successfully!', id: docId });
  } catch (err) {
    console.error('Error submitting flyer:', err);
    res.status(500).json({ message: 'Failed to submit flyer.' });
  }

});


// Endpoint for flyer submission
app.post('/reportingform', async (req, res) => {
  try {
    const { ownerName, dogName, dogBreed, dogColor, dogSize, cityName, metroArea, lastPlace, email, phoNum, dogPic, comments } = req.body;

    // Add flyer to Firestore
    const docRef = await db.collection('reports').add({
      ownerName,
      dogName,
      dogBreed,
      dogColor,
      dogSize,
      cityName,
      metroArea,
      lastPlace,
      email,
      phoNum,
      dogPic,
      comments,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('New report submitted:', { ownerName, dogName });
    res.json({ message: 'Report submitted successfully!', id: docRef.id });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ message: 'Failed to submit report.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
