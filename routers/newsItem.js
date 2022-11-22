const {NewsItem} = require('../models/newsitem');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const newsItems = await NewsItem.find().sort('date');
    if(!newsItems) {
        res.status(500).json({success: false})
    };
    res.status(200).send(newsItems);
});

router.get('/:id', async (req, res) => {
    const newsItem = await NewsItem.findById(req.params.id);
    if(!newsItem) {
        res.status(500).json({success: false})
    };
    res.status(200).send(newsItem);
});

router.post('/', async (req, res) => {
    let newsItem = new NewsItem({
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
    });
    newsItem = await newsItem.save();

    if(!newsItem)
    return res.status(404).send('the newsItem cannot be created!')

    res.send(newsItem);
});

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid NewsItem Id');
    }
    const newsItem = await NewsItem.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            content: req.body.content,
        },
        { new: true }
    )

    if(!newsItem)
    return res.status(404).send('the newsItem cannot be updated!')

    res.send(newsItem);
});

router.get('/get/count', async (req, res) => {
    const newsItemCount = await NewsItem.countDocuments((count) => count);

    if(!newsItemCount) {
        res.status(500).json({success: false})
    };
    res.send({
        newsItemCount: newsItemCount
    });
});

router.delete('/:id', (req, res) => {
    NewsItem.findByIdAndRemove(req.params.id).then(newsItem => {
        if(newsItem) {
            return res.status(200).json({success: true, message: 'the newsItem is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'newsItem not found!'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});


module.exports = router;