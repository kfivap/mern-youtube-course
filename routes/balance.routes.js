const User = require('../models/User')

const {Router} = require('express')

const router = Router()
const auth = require('../middleware/auth.middleware')
const Balance = require('../models/Balance')


router.get('/',auth, async (req,res)=>{
    try{

        const blnc = await User.findOne({_id: req.user.userId})

        res.status(200).json(blnc )

    } catch (e) {
        res.status(500).json({message: 'something went wrong'})
        console.log(e)
    }
})

module.exports = router