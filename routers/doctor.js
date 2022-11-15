const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const mongoose = require('mongoose');
const { Speciality} = require('../models/speciality');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Multer Config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if(isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function(req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({storage: storage});

router.get(`/`,async (req, res) => {
    let filter = {};
    if(req.query.specialities){

        filter = {speciality: req.query.specialities.split(',')}
    }
    const doctorList = await Doctor.find(filter).select('name profilePicture phone email speciality');

    if(!doctorList) {
        res.status(500).json({success: false})
    }
    res.send(doctorList);
});

router.get(`/:id`, async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate('speciality').select('name profilePicture phone email speciality');
    if(!doctor) {
        res.status(500).json({success: false})
    }
    res.status(200).send(doctor);
});

router.post(`/`, uploadOptions.single('profilePicture') , async (req, res) => {
    const speciality = await Speciality.findById(req.body.speciality);
    if(!speciality) return res.status(400).send('Invalid Speciality');

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const doctor = new Doctor({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        speciality: req.body.speciality,
        medicalLicenseNumber: req.body.medicalLicenseNumber,
        bio: req.body.bio,
        profilePicture: `${basePath}${fileName}`,
        price: req.body.price,
        isVerified: req.body.isVerified,
    });

    doctor = await doctor.save();
    if(!doctor)
    return res.status(500).send('the doctor cannot be created!');

    res.send(doctor);
});

router.post(`/register`, async (req, res) => {
    const speciality = await Speciality.findById(req.body.speciality);
    if(!speciality) return res.status(400).send('Invalid Speciality');

    const doctor = new Doctor({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        speciality: req.body.speciality,
        medicalLicenseNumber: req.body.medicalLicenseNumber,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
        price: req.body.price,
        isVerified: req.body.isVerified,
    });

    doctor = await doctor.save();
    if(!doctor)
    return res.status(500).send('the doctor cannot be created!');

    res.send(doctor);
});

router.put(`/:id`, async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Doctor Id');
    }

    const speciality = await Speciality.findById(req.body.speciality);
    if(!speciality) return res.status(400).send('Invalid Speciality');

    const doctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            speciality: req.body.speciality,
            medicalLicenseNumber: req.body.medicalLicenseNumber,
            bio: req.body.bio,
            profilePicture: req.body.profilePicture,
            price: req.body.price,
            isVerified: req.body.isVerified
        },
        { new: true }
    )

    if(!doctor)
    return res.status(404).send('the doctor cannot be updated!')

    res.send(doctor);
});

router.post('/login', async (req, res) => {
    const doctor = await Doctor.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!doctor) {
        return res.status(400).send('The doctor not found');
    }

    if(doctor && bcrypt.compareSync(req.body.password, doctor.passwordHash)) {
        const token = jwt.sign(
            {
                doctorId: doctor.id
            },
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send({doctor: doctor.email, token: token});
    } else {
        res.status(400).send('password is wrong!');
    }
});

router.get(`/get/count`,async (req, res) => {
    const doctorCount = await Doctor.countDocuments((count) => count);

    if(!doctorCount) {
        res.status(500).json({success: false})
    }
    res.send({
        doctorCount: doctorCount
    });
});


router.delete('/:id', (req, res) => {
    Doctor.findByIdAndRemove(req.params.id).then(doctor => {
        if(doctor) {
            return res.status(200).json({success: true, message: 'the doctor is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "doctor not found!"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;