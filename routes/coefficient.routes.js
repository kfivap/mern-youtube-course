const {Router} = require('express')

const router = Router()
const auth = require('../middleware/auth.middleware')
const Balance = require('../models/Balance')
const config = require('config')


router.post('/',auth, async (req,res)=>{
    try{

        const coef = coefficientTable(req.body.betType, req.body.betOn)


        res.status(200).json(coef )

    } catch (e) {
        res.status(500).json({message: 'something went wrong'})
        console.log(e)
    }
})

module.exports = router

const coefficientList=config.get('coefList')

const strictlyMoreCoefficient = {
    0: null,
    1: coefficientList[0],
    2: coefficientList[1],
    3: coefficientList[2],
    4: coefficientList[3],
    5: coefficientList[4],
    6: coefficientList[5],
    7: coefficientList[6],
    8: coefficientList[7],
    9: coefficientList[8]
}

const notStrictlyMoreCoefficient = {
    0: coefficientList[0],
    1: coefficientList[1],
    2: coefficientList[2],
    3: coefficientList[3],
    4: coefficientList[4],
    5: coefficientList[5],
    6: coefficientList[6],
    7: coefficientList[7],
    8: coefficientList[8],
    9: null
}

const strictlyLessCoefficient = {
    0: coefficientList[8],
    1: coefficientList[7],
    2: coefficientList[6],
    3: coefficientList[5],
    4: coefficientList[4],
    5: coefficientList[3],
    6: coefficientList[2],
    7: coefficientList[1],
    8: coefficientList[0],
    9: null
}

const notStrictlyLessCoefficient = {
    0: null,
    1: coefficientList[8],
    2: coefficientList[7],
    3: coefficientList[6],
    4: coefficientList[5],
    5: coefficientList[4],
    6: coefficientList[3],
    7: coefficientList[2],
    8: coefficientList[1],
    9: coefficientList[0]
}

const strictlyEqualsCoefficient = {
    0: coefficientList[0],
    1: coefficientList[0],
    2: coefficientList[0],
    3: coefficientList[0],
    4: coefficientList[0],
    5: coefficientList[0],
    6: coefficientList[0],
    7: coefficientList[0],
    8: coefficientList[0],
    9: coefficientList[0]
}


const coefficientTable = (betType, betOn) =>{
    if (betType === '> '){
        return  strictlyMoreCoefficient
    }
    if (betType === '>=') {
        return    notStrictlyMoreCoefficient
    }
    if (betType === '< ') {
        return   strictlyLessCoefficient
    }
    if (betType === '<=') {
        return   notStrictlyLessCoefficient
    }
    if (betType === '= ') {
        return  strictlyEqualsCoefficient
    }

}