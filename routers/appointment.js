const {Appointment} = require('../models/appointments');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    
    const appointmentList = await Appointment.find(filter).populate('user doctor type ');
    const userAppointmentList = await Appointment.find().populate('user', 'name phone email profilePicture').sort({'date': 1});

    if(!appointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(appointmentList);

    if(!userAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userAppointmentList);
})

router.get(`/:id`, async (req, res) => {
    const appointment = await Appointment.findById(req.params.id).populate('user doctor type');

    if(!appointment) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(appointment);
})

router.post(`/`, async (req, res) => {

    let appointment = new Appointment({
        doctor: req.body.doctor,
        date: req.body.date,
        time: req.body.time,
        type: req.body.type,
    })
    appointment = await appointment.save();

    if(!appointment)
    return res.status(404).send('the appointment cannot be created!')

    res.send(appointment);
});

router.put('/:id', async (req, res) => {
    
    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        {
            date: req.body.date,
            time: req.body.time,
            type: req.body.type,
        },
        {new: true}
    )

    if(!appointment)
    return res.status(404).send('the appointment cannot be updated!')

    res.send(appointment);
});

router.delete('/:id', (req, res) => {
    Appointment.findByIdAndRemove(req.params.id).then(appointment => {
        if(appointment) {
            return res.status(200).json({success: true, message: 'the appointment is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "appointment not found!"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});

router.get(`/get/count`,async (req, res) => {
    const appointmentCount = await Appointment.countDocuments((count) => count);

    if(!appointmentCount) {
        res.status(500).json({success: false})
    }
    res.send({
        appointmentCount: appointmentCount
    });
});

router.get(`/userappointments/:userid`, async (req, res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const appointmentList = await Appointment.find(filter).populate('user doctor type');
    const userAppointmentList = await Appointment.find({user: req.params.userid}).
    populate({path:'doctor', populate:{
        path:'speciality',
    }}).sort({'date': 1});

    if(!appointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(appointmentList);

    if(!userAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userAppointmentList);
})

module.exports = router;