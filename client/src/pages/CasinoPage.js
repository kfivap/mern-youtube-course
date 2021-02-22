import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";


export const CasinoPage = () =>{
    const [test, setTest] = useState([])
    const {loading, error, request, clearError}  =useHttp()
    const {token} = useContext(AuthContext)
    const [form, setForm] = useState({
        betOn: '', betType: '', betAmount:10
    })


    const  fetchCoeff  = useCallback( async () => {
        try{

            const fetched = await  request('/api/coefficient', 'POST', {...form}, {Authorization: `Bearer ${token}`})
            setTest(Object.values( fetched))
        //console.log(test)
         //   console.log(Object.values( fetched))

        } catch (e) {

        }

    }, [token, request, form])

    useEffect( ()=>{
        fetchCoeff()
    }, [fetchCoeff])

    const [chooseBet, setChooseBet] = useState('число')

    const [result1, setResult1] = useState()
    const [result2, setResult2] = useState()
    const [result3, setResult3] = useState()
    const [result4, setResult4] = useState()

   // {betOn: chooseBet, betType: 123, betAmount:10},
    const  placeBet  =  async (e) => {
        if(form.betOn !== '' && form.betType !== '')
        {


        try{
            const fetched = await  request('/api/casino', 'POST', {...form},
                {Authorization: `Bearer ${token}`})

            console.log(fetched)
            setResult1(`Bet on ${fetched.betOn}
             ${fetched.betType}
             ${fetched.random} (random)
             `)

            const textWin = fetched.win ? 'WIN!' : 'Lose'
            setResult2(`${textWin}`)
            setResult3(parseFloat(fetched.diff).toFixed(2))
            setResult4(parseFloat(fetched.balance).toFixed(2))

           // setTest(JSON.stringify(fetched))
        } catch (e) {

        }
    }
        else {
            window.M.toast({html: 'Выбраны не все параметры'})
        }
    }


    const  fetchBalance  = useCallback( async () => {
        try{
            const fetched = await  request('/api/balance', 'GET', null, {Authorization: `Bearer ${token}`})
            //console.log(fetched.money)
            //console.log(form)
            setResult4(fetched.money.toFixed(2))
        } catch (e) {

        }

    }, [token, request])

    useEffect( ()=>{
        fetchBalance()
    }, [fetchBalance])





    const betNumberHandler = (e)=>{

        setChooseBet( e.target.innerHTML)
       setForm({...form, betOn:e.target.innerHTML})

    }

    const [choseType, setChoseType] = useState()

    const betTypeHandler = (e)=>{
        const BT = e.target.attributes.bettype.value


        setChoseType(BT)
        setForm({...form, betType: BT})
        //console.log(form)
        fetchCoeff()

    }




    return(<div>

        {/*{test}*/}
        <div className={'card'}>
            <div className="card-content">
                <h5>{chooseBet}</h5>
            </div>
        </div>
        <div >

            <table>
                <tbody>
                <tr>

                    {
                        [0,1,2,3,4,5,6,7,8,9].map((el, index) =>
                            <td  key={`td_el_${el}`}>
                            <button
                                key={`el_${el}`}
                                style={{margin: 3}}
                                className={'btn grey liten-4 black-text'}
                                onClick={betNumberHandler}

                            >
                                {el}
                            </button>
                                <br/>

                                <span
                                    key={`coef_${el}`}
                                    style={{margin: 3, fontSize: 18}}
                                    className={'badge  black-text'}
                                >
                        {test[index]}</span>

                            </td>

                        )
                    }
                </tr>
                <tr>


                </tr>

                </tbody>
            </table>




        </div>

        <div className={'card'}>
            <div>
                <h5>Cпор {chooseBet} {choseType} random(0,9)</h5>
            </div>
        </div>

        <div >
            {
                [`> ${chooseBet} больше случайного`,
                    `>= ${chooseBet} больше или равно случайному`,
                    `< ${chooseBet} меньше случайного`,
                    `<= ${chooseBet} меньше или равно случайному`,
                    `= ${chooseBet} равно случайному`,


                    ].map( (el, i) =>
                    <button
                        key={i}
                        style={{margin: 3}}
                        className={'btn grey liten-4 black-text'}
                        bettype={el.slice(0,2)}
                        onClick={betTypeHandler}


                    >
                        {el}
                    </button>

                )
            }
        </div>

        <div className={'card'}
             style={{height: 80}}>
            <div className="card-content"
            >
                <button
                    className={'btn yellow darken-4  right black-text'}
                    onClick={placeBet}
                >
                    Сделать ставку
                </button>
            </div>
        </div>

        <div className={'card'}>

<h4>Bet info: {result1}</h4>
        <br/>
<h4>Result: {result2}</h4>
        <br/>
<h4>Money: {result3}</h4>
       <br/>
<h4>Balance: {result4}</h4>



        </div>


    </div>)
}