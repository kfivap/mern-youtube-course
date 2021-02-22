const {Router} = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router =  Router()
const Balance = require('../models/Balance')

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'incorrect email').isEmail(),
        check('password', 'min length 6 symbols').isLength({min:6})
    ],
    async (req, res) =>{
    try{
        console.log('body: ', req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'incorrect registration data'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email: email})

        if(candidate){
            return res.status(400).json({message: 'this user already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        if (email=='admin@admin.ru'){
            const user = new User({email, password: hashedPassword, money: 0, isCasinoAccount: true})
            await user.save()
        }
        else{
        const user = new User({email, password: hashedPassword, money: 0})
            await user.save()
        }






        res.status(201).json({message: 'user added'})



} catch (e) {
        res.status(500).json({ message: "something went wrong"})
        console.log(e)

}
})


// /api/auth/login
router.post('/login',
    [
        check('email', 'type correct email').normalizeEmail().isEmail(),
        check('password', 'type password').exists()
    ],
    async (req, res) =>{
        try{


            const errors = validationResult(req)


            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorrect login data'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email})

            if (!user){
                return res.status(400).json({message: 'user not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch){
                return res.status(400).json({
                    message: 'incorrect password try again'
                })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({ message: "something went wrong"})
           console.log(e)
        }
})


module.exports  =router