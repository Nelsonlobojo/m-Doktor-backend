const MedicalRecord = require('../models/medicalrecord');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    const medicalRecordList = await MedicalRecord.find().populate();

    if(!medicalRecordList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(medicalRecordList);
})

router.get(`/:id`, async (req, res) => {
    const medicalRecord = await MedicalRecord.findById(req.params.id).populate();

    if(!medicalRecord) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(medicalRecord);
});

router.post(`/`, async (req, res) => {

    let medicalRecord = new MedicalRecord({
        appointment: req.body.appointment,
        user: req.body.user,
        doctor: req.body.doctor,
        date: req.body.date,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        prescription: req.body.prescription,
    })
    medicalRecord = await medicalRecord.save();

    if(!medicalRecord)
    return res.status(404).send('the medical record cannot be created!')

    res.send(medicalRecord);
});

router.get('/user/:userid', async (req, res) => {
    const medicalRecordList = await MedicalRecord.find({user: req.params.userid}).populate(["doctor","user","appointment"]).sort({'date': 1});

    if(!medicalRecordList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(medicalRecordList);
})


module.exports = router;