const {Review} = require('../models/review');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.doctors){
        filter = {doctor: req.query.doctors.split(',')}
    }
    const reviewList = await Review.find(filter).populate();

    if(!reviewList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(reviewList);
});

router.get(`/:id`, async (req, res) => {
    const review = await Review.findById(req.params.id).populate();

    if(!review) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(review);
});

router.post(`/`, async (req, res) => {
    let review = new Review({
        doctor: req.body.doctor,
        rating: req.body.rating,
        comment: req.body.comment,
    })
    review = await review.save();

    if(!review)
    return res.status(404).send('the review cannot be created!')

    res.send(review);
});

router.put('/:id', async (req, res) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        {
            rating: req.body.rating,
            comment: req.body.comment,
        },
        {new: true}
    )

    if(!review)
    return res.status(404).send('the review cannot be updated!')

    res.send(review);
});

router.get(`/get/count`, async (req, res) => {
    const reviewCount = await Review.countDocuments((count) => count);

    if(!reviewCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        reviewCount: reviewCount
    });
})

router.delete('/:id', (req, res) => {
    Review.findByIdAndRemove(req.params.id).then(review => {
        if(review) {
            return res.status(200).json({success: true, message: 'the review is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "review not found!"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});

router.get(`/doctorreviews/:doctorid`, async (req, res) => {
    
    const doctorReviewsList = await Review.find({doctor: req.params.doctorid}).
    populate('rating comment').sort({'date': 1});

    if(!doctorReviewsList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(doctorReviewsList);
})

module.exports = router;