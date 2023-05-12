import React, { useEffect, useState } from 'react';
import * as searchServices from '../../services/searchService';
import { Link } from 'react-router-dom';
import styles from './login.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../../auth/Auth';
import store from '../../redux/store';
const cx = classNames.bind(styles);
function Login() {
    const user=useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [login, setLogin] = useState({ user: '', password: '' });
    const [respone, setReponse] = useState({ user: '', status: false, type: '', message: '' });
    const navigate = useNavigate();
    //lay du lieu user
    const HandleUser = (e) => {
        setLogin({ ...login, user: e.target.value });
    };

    //lay du lieu password
    const HandlePassword = (e) => {
        setLogin({ ...login, password: e.target.value });
    };
    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();
    };
    //ve lap vao web register car ae eo can hieu
    const HandleLogin = async (e) => {
        //get list user from database
        const listUser = await GetListUser();

        //filter username
        const filteruser = listUser.filter((username) => {
            if (username.username == login.user) {
                return true;
            }
            return false;
        });
        //check username legit
        if (filteruser.length === 0) {
            setReponse({ ...respone, message: "Username doesn't exsit" });
            console.log(respone);
        }

        //username is unique

        //check password
        if (filteruser[0].password !== login.password) {
            setReponse({ ...respone, message: 'Invalid password' });
            console.log(respone);
        } else {
            //login sucess and navigate
            navigate(`../${filteruser[0].type}/${filteruser[0].username}`)
        }
    };
    //theo cuar ban hieu :))
    const tmpLogin=async ()=>{
        await dispatch(requestLogin({login}))
        let user=store.getState().auth;
        if(user.user!=null){
            navigate(`../${user.role}/${user.user}`)
        }
        // const res = await searchServices.post("/account",{...login,user:login.user}).then(res=>{
        //     console.log(res)
        //     return res})

        // // if(res.status=="Fail") setReponse({ ...respone, message: res.detail})
        // // else navigate(`../${res.type}/${res.user}`)
    }
    const GetListUser = async () => {
        const res = await searchServices.get(`/account`);

        return res || [];
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('login')}>
                <h2 className={cx('active', 'h2tag')}> sign in </h2>
                <form className={cx('formtag')} onSubmit={handleSubmit}>
                    <p className={cx('message')}>{respone.message}</p>
                    <input type="text" className={cx('text', 'inputtag')} name="username" onChange={HandleUser} />
                    <span className={cx('spantag')}>username</span>

                    <br></br>

                    <br></br>

                    <input
                        type="password"
                        className={cx('text', 'inputtag')}
                        name="password"
                        onChange={HandlePassword}
                    />
                    <span className={cx('spantag')}>password</span>
                    <br />

                    <input type="checkbox" id="checkbox-1-1" className={cx('custom-checkbox')} />
                    <label className={cx('labeltag')} htmlFor="checkbox-1-1">
                        Keep me Signed in
                    </label>

                    {/* //  onClick={e=>{e.stopPropagation();}}   */}
                    <button className={cx('signin')} onClick={tmpLogin}>
                        Sign In
                    </button>

                    <hr className={cx('hrtag')} />

                    <a className={cx('atag')} href="#">
                        Forgot Password?
                    </a>
                </form>
            </div>
        </div>
    );
}

export default Login;
