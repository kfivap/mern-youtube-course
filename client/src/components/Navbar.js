import React, { useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const Navbar = () =>{
    const history = useHistory()

    const auth = useContext(AuthContext)

    const logoutHandler = event =>{
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    return(
        <nav>
            <div className="nav-wrapper blue darken-1"
            style={{padding: '0 2rem'}}
            >
                <span className="brand-logo right">MyApp</span>
                <ul  >
                    <li><NavLink to={'/create'}>Create</NavLink></li>
                    <li><NavLink to={'/links'}>Links</NavLink></li>
                    <li><NavLink to={'/test'}>test</NavLink></li>
                    <li><NavLink to={'/casino'}>casino</NavLink></li>

                    <li><a href='/' onClick={logoutHandler}>Выйти</a></li>

                </ul>
            </div>
        </nav>)
}