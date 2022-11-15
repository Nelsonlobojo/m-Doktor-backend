const {MedicalRecord} = require('../models/medicalrecord');
const {Appointment} = require('../models/appointments');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.appointments){
        filter = {appointment: req.query.appointments.split(',')}
    }
    const medicalRecordList = await MedicalRecord.find(filter).populate();

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
    let appointment = await Appointment.findById(req.body.appointment);
    if(!appointment)
    return res.status(400).send('Invalid appointment.');

    let medicalRecord = new MedicalRecord({
        appointment: req.body.appointment,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        prescription: req.body.prescription,
    })
    medicalRecord = await medicalRecord.save();

    if(!medicalRecord)
    return res.status(404).send('the medical record cannot be created!')

    res.send(medicalRecord);
});