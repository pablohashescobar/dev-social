const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');

//@route POST api/users
//@desc Register a new User
//@acess Public
router.post('/',[
    check('name', 'Please Enter a Name')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email')
    .isEmail(),
    check('password', 'Password must be atleast 6 characters long')
    .isLength({min: 6})
], (req, res) => {
    console.log(req.body);
    res.send('User Route')
});

module.exports = router;