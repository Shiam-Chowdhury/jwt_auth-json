const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.get('/all', (req, res) => {
    res.json(users);
})

router.post('/signup', [
        check("email", "please provide a valid email").isEmail(),
        check("password", "please provide password greater than 5 characters").isLength({ min: 6 })
    ], async (req, res) => {
    const {password, email} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let user = await users.find((user) => {
        return user.email === email
    });

    if(user){
        return res.status(400).json({
            "errors": [
                {
                    "message": "user already exists!"
                }
            ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email,
        password: hashedPassword
    });

    const token = JWT.sign({
        email
    }, "jsabfkjsfsjfksafslkfnsalkfsdf",
        {
            expiresIn: 3600000
        }
    );

    // console.log(hashedPassword);

    res.json({
        token
    })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = users.find((user) => {
        return user.email === email;
    })

    if(!user){
        return res.status(4000).json({
            "errors": [
                {
                    'message' : 'Invalid email provided!'
                }
            ]
        })
    }

    let isMatch = bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(4000).json({
            "errors": [
                {
                    'message' : 'password not match!'
                }
            ]
        })
    }

    const token = JWT.sign({
        email
    }, "jsabfkjsfsjfksafslkfnsalkfsdf", {
        expiresIn: 36000
    });

    res.json({
        token
    })

})

module.exports = router