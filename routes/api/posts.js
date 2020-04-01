const express = require('express');
const router = express.Router();


//@route GET api/posts
//@desc TEST route
//@acess Public
router.get('/', (req, res) => {
    res.send('Post Route')
});

module.exports = router;