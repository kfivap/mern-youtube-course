import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import './TestPage.css'

export const TestPage = () =>{

    const [test, setTest] = useState([])
    const {loading, error, request, clearError}  =useHttp()
    const {token} = useContext(AuthContext)
    const  fetchLinks  = useCallback( async () => {
        try{
            const fetched = await  request('/test', 'GET', null, {Authorization: `Bearer ${token}`})
            //setLinks(fetched)
            setTest(JSON.stringify(fetched))
        } catch (e) {

        }

    }, [token, request])

    useEffect( ()=>{
        fetchLinks()
    }, [fetchLinks])




    const [form, setForm] = useState({
        firstInput: '', secondInput: ''
    })


    useEffect(()=>{
        clearError()
    }, [error, clearError])



    const changeHandler = event =>{
        setForm({...form, [event.target.name]: event.target.value})
        //console.log({...form})
        //console.log(event.target.name)
    }
    const [compute, setCompute] = useState('действие')
    const registerHandler = async (e) =>{
        try{
            const compute = e.target.innerHTML[0]
            setCompute(compute)
            //console.log(form)
            const data = await request('/test', "POST", {...form, compute})


            if (data.isn){
                return   setTest111('error not a number')
            }

            setTest111(('Результат: '+ data.count))

           // console.log('data: ',  data)
        } catch (e) {

        }
    }

    const [test111, setTest111] = useState('Калькулятор!')

    const [chooseString, setChooseString] = useState(1)
    const chooseStringHandler = (pr, e) =>{
       // console.log('e:', e)
        console.log('pr:',pr)
       setChooseString(pr)
    }

//console.log(chooseString)

const digitHandler = (e) =>{
        const digit = e.target.innerHTML

if(chooseString===1) {

    if (digit==='←'){
        document.querySelector('#firstInput').value =
            document.querySelector('#firstInput').value.slice(0, -1)
        setForm({...form, firstInput: form.firstInput.slice(0, -1)})
        return
    }
    document.querySelector('#firstInput').value=form.firstInput + digit
    setForm({...form, firstInput: form.firstInput+digit})
}

if(chooseString===2) {

    if (digit==='←'){
        document.querySelector('#secondInput').value =
            document.querySelector('#secondInput').value.slice(0, -1)
        setForm({...form, secondInput: form.secondInput.slice(0, -1)})
        return
    }


    document.querySelector('#secondInput').value=form.secondInput + digit
    setForm({...form, secondInput: form.secondInput+digit})
}

}




    let top = (loading ? <Loader/> : test)


    return(
        <div>

            {top}
            <br/>


                    <h4>
                        Калькулятор</h4>
            <br/>


            <div>
                <div className="input-field">
                    <input
                        id='firstInput'
                        placeholder="Type first number"
                        type="text"
                        name={'firstInput'}
                        className='yellow-input'
                        value={form.firstInput}
                        onChange={changeHandler}
                        onClick={chooseStringHandler.bind(1,1)}
                    />

                </div>
                <div>
                    {compute}
                </div>
                <div className="input-field">
                    <input
                        id='secondInput'
                        placeholder="Type second number"
                        type="text"
                        name={'secondInput'}
                        className='yellow-input'
                        value={form.secondInput}
                        onChange={changeHandler}
                        onClick={chooseStringHandler.bind(2,2)}
                    />

                </div>
                <div className="card">
                    <div className="card-content">
                        <h4>
                            {test111}</h4>
                    </div>
                </div>

            </div>

            <div className={'computing'}>
            {
                ['+ ADD +', '- SUB -', '* MULT *', '/ DIV /'].map(el =>
                    <button
                        className={'btn grey liten-4 black-text'}
                        style={{margin: 5}}
                        onClick={registerHandler}
                        disabled={loading}
                        key={el}
                    >
                        {el}
                    </button>)
            }
            </div>

        <div className={'numbers'}>
            {
                [1,2,3,4,5,6,7,8,9,0, '←'].map(el =>
                    <button
                        key={el}
                        style={{margin: 3}}
                        className={'btn grey liten-4 black-text'}
                        onClick={digitHandler}

                    >
                        {el}
                    </button>)
            }
        </div>


        </div>

    )
}