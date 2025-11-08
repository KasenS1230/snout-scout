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
    const { bystandName, dogName, dogBreed, dogColor, lastPlace, email, phoNum } = req.body;

    // Add flyer to Firestore
    const docRef = await db.collection('flyers').add({
      bystandName,
      dogName,
      dogBreed,
      dogColor,
      lastPlace,
      email,
      phoNum,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('New flyer submitted:', { bystandName, dogName });
    res.json({ message: 'Flyer submitted successfully!', id: docRef.id });
  } catch (err) {
    console.error('Error submitting flyer:', err);
    res.status(500).json({ message: 'Failed to submit flyer.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
