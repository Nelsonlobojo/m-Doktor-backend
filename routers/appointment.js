const Appointment = require('../models/appointments');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    
    let userAppointmentList = await Appointment.find().populate(["doctor","user"]).sort({'date': 1});

    if(!userAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userAppointmentList);
})

router.get(`/:id`, async (req, res) => {
    let appointment = await Appointment.findById(req.params.id).populate('user doctor');

    if(!appointment) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(appointment);
})

router.post(`/`, async (req, res) => {

    let appointment = new Appointment({
        user: req.body.user,
        doctor: req.body.doctor,
        date: req.body.date,
        time: req.body.time,
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
        },
        {new: true}
    )

    if(!appointment)
    return res.status(404).send('the appointment cannot be updated!')

    res.send(appointment);
});

router.put('/status/:id', async (req, res) => {
        
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            {new: true}
        )
    
        if(!appointment)
        return res.status(404).send('the appointment cannot be updated!')
    
        res.send(appointment);
})

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

router.get(`/userappointments/pending/:userid`, async (req, res) => {


    let userAppointmentList = await Appointment.find({ user: req.params.userid , status: 'Pending'}).
    populate(["doctor","user"]).sort({'date': 1});


    if(!userAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userAppointmentList);
})

router.get(`/doctorappointments/pending/:doctorid`, async (req, res) => {


    let doctorAppointmentList = await Appointment.find({ doctor: req.params.doctorid , status: 'Pending'}).
    populate(["doctor","user"]).sort({'date': 1});


    if(!doctorAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(doctorAppointmentList);
})

router.get(`/userappointments/completed/:userid`, async (req, res) => {


    let userAppointmentList = await Appointment.find({ user: req.params.userid , status: 'Completed'}).
    populate(["doctor","user"]).sort({'date': 1});


    if(!userAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userAppointmentList);
})

router.get(`/doctorappointments/completed/:doctorid`, async (req, res) => {


    let doctorAppointmentList = await Appointment.find({ doctor: req.params.doctorid , status: 'Completed'}).
    populate(["doctor","user"]).sort({'date': 1});


    if(!doctorAppointmentList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(doctorAppointmentList);
})

module.exports = router;