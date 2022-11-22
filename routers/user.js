const express = require('express');
const router = express.Router();
const User  = require('../models/user');
const mongoose = require('mongoose');
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
    let userList = await User.find().select();

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
});

router.get(`/:id`, async (req, res) => {
    let user = await User.findById(req.params.id).select();
    if(!user) {
        res.status(500).json({success: false})
    }
    res.send(user);
});

router.post(`/`, uploadOptions.single('profilePicture'), async (req, res) => {

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        profilePicture: `${basePath}${fileName}`,
    });

    user = await user.save();
    if(!user)
    return res.status(500).send('the user cannot be registered!');

    res.send(user);
});

router.post(`/register`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        profilePicture: req.body.profilePicture,
    });

    user = await user.save();
    if(!user)
    return res.status(500).send('the user cannot be registered!');

    res.send(user);
});

router.post(`/login`,async (req, res) => {
    let user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send('the user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token});
    }
    else{
        res.status(400).send('password is wrong');
    }
});

router.put(`/:id`, async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid User Id');
    }

    let user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            //profilePicture: req.body.profilePicture,
        },
        {new: true}
    )

    if(!user)
    return res.status(500).send('the user cannot be updated!');

    res.send(user);

});

router.get(`/get/count`,async (req, res) => {
    const userCount = await User.countDocuments((count) => count);

    if(!userCount) {
        res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    });
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "user not found!"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;