const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// @route    GET api/users/suggestions
// @desc     Get user suggestions
// @access   Private
router.get('/suggestions', auth, async (req, res) => {
    try {
        // Find users not being followed by current user
        const currentUser = await User.findById(req.user.id);
        const suggestions = await User.find({
            _id: { $ne: req.user.id, $nin: currentUser.following }
        }).limit(5).select('-password');

        res.json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/users/follow/:id
// @desc     Follow a user
// @access   Private
router.put('/follow/:id', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ msg: 'User already followed' });
        }

        currentUser.following.unshift(req.params.id);
        userToFollow.followers.unshift(req.user.id);

        await currentUser.save();
        await userToFollow.save();

        // Emit notification via Socket.io
        const io = req.app.get('socketio');
        io.to(req.params.id).emit('notification', {
            type: 'follow',
            from: currentUser.name,
            fromId: currentUser.id
        });

        res.json(currentUser.following);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/users/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
        const uri = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`;
        const headers = {
            'user-agent': 'node.js'
        };

        const githubResponse = await axios.get(uri, { headers });
        res.json(githubResponse.data);
    } catch (err) {
        console.error(err.message);
        res.status(404).json({ msg: 'No Github profile found' });
    }
});

// @route    GET api/users/profile/:id
// @desc     Get user profile by ID
// @access   Private
router.get('/profile/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(400).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
