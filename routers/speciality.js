const {Speciality} = require('../models/speciality');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    const specialityList = await Speciality.find();

    if(!specialityList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(specialityList);
})

router.get(`/:id`, async (req, res) => {
    const speciality = await Speciality.findById(req.params.id);

    if(!speciality) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(speciality);
})

router.post(`/`, async (req, res) => {
    let speciality = new Speciality({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    speciality = await speciality.save();

    if(!speciality)
    return res.status(404).send('the speciality cannot be created!')

    res.send(speciality);
});

router.put(`/:id`, async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Speciality Id');
    }
    const speciality = await Speciality.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    )

    if(!speciality)
    return res.status(404).send('the speciality cannot be updated!')

    res.send(speciality);
});

router.delete('/:id', (req, res) => {
    Speciality.findByIdAndRemove(req.params.id).then(speciality => {
        if(speciality) {
            return res.status(200).json({success: true, message: 'the speciality is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "speciality not found!"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;