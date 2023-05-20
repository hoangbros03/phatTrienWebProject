import React, { useEffect, useState } from 'react';
import * as searchServices from '../../services/searchService';
import { Link } from 'react-router-dom';
import styles from './login.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../../auth/Auth';
import store from '../../redux/store';
import { message } from 'antd';
const cx = classNames.bind(styles);

function Login() {
    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Bạn đã đăng nhập thành công',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'warning',
            content: 'Bạn đã đăng nhập thất bại, vui lòng thử lại',
        });
    };
    const [login, setLogin] = useState({ user: '', password: '', role: '3000' });
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
    // const HandleLogin = async (e) => {
    //     //get list user from database
    //     const listUser = await GetListUser();

    //     //filter username
    //     const filteruser = listUser.filter((username) => {
    //         if (username.username == login.user) {
    //             return true;
    //         }
    //         return false;
    //     });
    //     //check username legit
    //     if (filteruser.length === 0) {
    //         setReponse({ ...respone, message: "Username doesn't exsit" });
    //         console.log(respone);
    //     }

    //     //username is unique

    //     //check password
    //     if (filteruser[0].password !== login.password) {
    //         setReponse({ ...respone, message: 'Invalid password' });
    //         console.log(respone);
    //     } else {
    //         //login sucess and navigate
    //         navigate(`../${filteruser[0].type}/${filteruser[0].username}`);
    //     }
    // };
    //theo cuar ban hieu :))
    const tmpLogin = async () => {
        console.log(login)
        await dispatch(requestLogin({ ...login }));
        let user = store.getState().auth;
        if (user.accesstoken != null) {
            success();
            setTimeout(
                () => navigate(`../${user.role == 3000 ? 'trungtamdangkiem' : 'cucdangkiem'}/${user.user}`),
                700,
            );
        }
        else {
            error();
        }
    };
    const GetListUser = async () => {
        const res = await searchServices.get(`/account`);

        return res || [];
    };
    const handleCheckRole = (e) => {
        console.log("KKK")
        setLogin({ ...login, role: '2000' });
    };

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
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

                    <input type="checkbox" id="checkbox-1-1" className={cx('custom-checkbox')} onChange={handleCheckRole}/>
                    <label className={cx('labeltag')} htmlFor="checkbox-1-1" >
                        Cục đăng kiểm
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
