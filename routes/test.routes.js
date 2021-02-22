const {Router} = require('express')
const Link = require('../models/Link')
const router = Router()




router.get('/', async (req,res)=>{
    try{

        //res.status(200).json(req.headers)

        res.status(200).json(` GET Response 200 (for test only). This app uses POST request ` )

    } catch (e) {
        res.status(500).json({message: 'something went wrong'})
        console.log(e)
    }
})

router.post('/', async (req,res)=>{
    try{

        const count = (funcCount(+req.body.firstInput, +req.body.secondInput, req.body.compute))


        console.log(req.body)
        res.status(200).json(({count:count, isn:(isNaN(count))}))


    } catch (e) {
        res.status(500).json({message: 'something went wrong'})
        console.log(e)
    }
})

module.exports = router

function funcCount(a, b, compute) {
    if(compute === '+'){return a+b}
    if(compute === '-'){return a-b}
    if(compute === '*'){return a*b}
    if(compute === '/'){return a/b}
}

