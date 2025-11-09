<<<<<<< HEAD
// report.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
=======
import firebase from 'firebase/compat/app';
import {
  getFirestore, collection, getDocs
} from 'firebase/firestore'

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
>>>>>>> origin/be-dataconnect

const app = express();
const PORT = 5500;

// Firebase Admin SDK
<<<<<<< HEAD
const serviceAccount = require('./key.json');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_Key = process.env.SENDGRID_API_Key;
console.log('Loaded API KEY:', SENDGRID_API_Key);
sgMail.setApiKey(SENDGRID_API_Key);
=======
const serviceAccount = JSON.parse(readFileSync('./key.json', 'utf-8'));

>>>>>>> origin/be-dataconnect
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

app.get('/test-email', async (req, res) => { 
  
  try { 
    
  
    const senderEmail = 'carverdewsford@gmail.com';

    const recipientEmail = 'carverdewsford@gmail.com';
    //^We will want this to NOT be me, but rather be the information of the one who lost the dog.


    const msg = {
      to: recipientEmail,
      from: senderEmail,
      subject: 'Snout Scout - Test Email Alert!',
      text: 'HURRAAAY PLEAAAASE',
      html: '<strong> If you are reading this, jump up and cry</strong>'
      //This is all testing junk!^ We want this to encourage the user to check out a high match.
    };

    
    await sgMail.send(msg);
    
    console.log('Test email sent!');
    res.send('Test email sent!');

  } catch(error) {
    
    console.error('Error sending test email:' , error);

    if(error.response) {
      console.error(error.response.body)
    }
    
    res.status(500).send('Error sending test email.');
  }
  
  
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ===============================================
// === NEW ENDPOINT TO GET 'MISSING' REPORTS ===
// ===============================================
app.get('/reports', async (req, res) => {
  try {
    // Query the 'reports' collection, order by creation time, descending (newest first)
    const snapshot = await db.collection('reports').orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      console.log('No reports found');
      return res.json([]); // Send back an empty array
    }

    const reports = [];
    snapshot.forEach((doc) => {
      // Push all data from the document, plus its ID
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Send the array of reports back to the frontend
    res.json(reports);

  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ message: 'Failed to retrieve reports.' });
  }
});


// ===============================================
// === NEW ENDPOINT TO GET 'FOUND' FLYERS ===
// ===============================================
app.get('/flyers', async (req, res) => {
  try {
    // Query the 'flyers' collection, order by creation time, descending (newest first)
    const snapshot = await db.collection('flyers').orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      console.log('No flyers found');
      return res.json([]); // Send back an empty array
    }

    const flyers = [];
    snapshot.forEach((doc) => {
      // Push all data from the document, plus its ID
      flyers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Send the array of flyers back to the frontend
    res.json(flyers);

  } catch (error) {
    console.error('Error getting flyers:', error);
    res.status(500).json({ message: 'Failed to retrieve flyers.' });
  }
});


// We no longer need this function to be called on startup.
// It's now handled by the app.get('/reports') endpoint when the frontend asks for it.
// getData();


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
