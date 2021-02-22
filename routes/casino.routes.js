const {Router} = require('express')

const router = Router()
const auth = require('../middleware/auth.middleware')
const Balance = require('../models/Balance')
const User = require('../models/User')
const config = require('config')
const minimalBalance = config.get('casinoMinimumBalance')


router.get('/', auth, async (req,res)=>{
    try{

//console.log(coefficientTable())
        console.log(req.body)

        res.status(200).json(132 )

    } catch (e) {
        res.status(500).json({message: 'something went wrong'})
        console.log(e)
    }
})




router.post('/', auth,async (req,res)=>{
    try{

        const RB= req.body
        //console.log('req body: ', req.body)
let random = Math.floor(Math.random()*10)
        let betcomp =  betComputing(RB.betOn, RB.betType, RB.betAmount, random)
        let win = betcomp['win']
        let diff = betcomp['diff']
        let rnd = betcomp['rnd']

        const blnc = await User.findOne({_id: req.user.userId})
        const casinoBalance = await User.findOne({isCasinoAccount: true})



       if(casinoBalance.money-diff < minimalBalance ){
           console.log(`Баланс казино после исхода будет менее установленного(${casinoBalance.money-diff}). \nРезультат будет скорректирован`)
           while (win != false) {
               let random = Math.floor(Math.random() * 10)
               let betcomp = betComputing(RB.betOn, RB.betType, RB.betAmount, random)
               rnd = betcomp['rnd']
               diff = betcomp['diff']
                win = betcomp['win']
              // console.log(rnd, win)
           }



        }

               blnc.money += diff
               casinoBalance.money -= diff

              //blnc.money = 100
              //casinoBalance.money = 100

              await blnc.save()
              await casinoBalance.save()


        res.status(200).json({
            betOn: RB.betOn,
            betType: RB.betType,
            betAmount: RB.betAmount,
            win: win,
            random: rnd,
            diff: diff,
            balance: blnc.money
        } )

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

const strictlyEqualsCoefficient = coefficientList[0]


const betComputing = (betOn, betType, betAmount, rnd) =>{
    //let rnd = Math.floor(Math.random()*10)
    let win=null
    let diff=0
//////////////////////
    if (betType === '> '){
        if(strictlyMoreCoefficient[parseInt(betOn)]===null){
         //   console.log(null)
            return {win: false, diff: 0, rnd}
        }
        if(parseInt(betOn)>rnd){
            diff=betAmount * strictlyMoreCoefficient[parseInt(betOn)]
            win=true
        }
        else {
            diff=-betAmount
            win=false
        }
      //  console.log('coef', strictlyMoreCoefficient[parseInt(betOn)])
        return{win, diff, rnd}
    }
//////////////////
    if (betType === '>=') {
        if(notStrictlyMoreCoefficient[parseInt(betOn)]===null){
           // console.log(null)
            return {win: false, diff: 0, rnd}
        }
        if (parseInt(betOn) >= rnd) {
            diff=betAmount * notStrictlyMoreCoefficient[parseInt(betOn)]
            win=true
        } else {
            diff=-betAmount
            win=false
        }
     //   console.log('coef', notStrictlyMoreCoefficient[parseInt(betOn)])
        return{win, diff, rnd}
    }
///////////////////////////
    if (betType === '< '){
        if(strictlyLessCoefficient[parseInt(betOn)]===null){
          //  console.log(null)
            return {win: false, diff: 0, rnd}
        }
        if(parseInt(betOn) < rnd){
            diff=betAmount * strictlyLessCoefficient[parseInt(betOn)]
            win=true
        }
        else {
            diff=-betAmount
            win=false
        }
      // console.log('coef', strictlyLessCoefficient[parseInt(betOn)])

        return{win, diff, rnd}

    }
////////////////////
    if (betType === '<='){
        if(notStrictlyLessCoefficient[parseInt(betOn)]===null){
          //  console.log(null)
            return {win: false, diff: 0, rnd}
        }
        if(parseInt(betOn) <= rnd){
            diff=betAmount * notStrictlyLessCoefficient[parseInt(betOn)]
            win=true
        }
        else {
            diff=-betAmount
            win=false
        }
//        console.log('coef', notStrictlyLessCoefficient[parseInt(betOn)])
        return{win, diff, rnd}
    }
    ///////////////
    if (betType === '= '){
        if(strictlyEqualsCoefficient[parseInt(betOn)]===null){
           // console.log(null)
            return {win: false, diff: 0, rnd}
        }
        if(parseInt(betOn) === rnd){
            diff=betAmount * strictlyEqualsCoefficient
            win=true
        }
        else {
            diff=-betAmount
            win=false
        }
        //console.log('coef',strictlyEqualsCoefficient)
        return{win, diff, rnd}
    }

}

