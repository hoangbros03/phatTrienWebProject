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
import { Box, Stack, Typography, Tabs, Tab, TextField, FormHelperText, Button, Alert, FormControlLabel, Checkbox } from '@mui/material';
const cx = classNames.bind(styles);

function Login() {
    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState("unsent");

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Bạn đã đăng nhập thành công',
        });
        setStatus("success");
    };
    const error = () => {
        messageApi.open({
            type: 'warning',
            content: 'Bạn đã đăng nhập thất bại, vui lòng thử lại',
        });
        setStatus("failure");
    };
    const [login, setLogin] = useState({ user: '', password: '', role: '3000' });
    const [respone, setReponse] = useState({ user: '', status: false, type: '', message: '' });
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [roleCheck, setRoleCheck] = useState('3000');

    const navigate = useNavigate();
    //lay du lieu user
    const HandleUser = (e) => {
        setLogin({ ...login, user: e.target.value });
    };

    const check = (e) => {
        console.log(e.target.value)
    }
    //lay du lieu password
    const HandlePassword = (e) => {
        setLogin({ ...login, password: e.target.value });
    };
    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();
    };

    const tmpLogin = async () => {
        console.log(login)
        dispatch(requestLogin({ ...login }));
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
        if(e.target.checked) {
            setRoleCheck('2000');
        } else {
            setRoleCheck('3000');
        }
    };

    const dumb = () => {
        const loginData = { user: name, password: pass, role: roleCheck };
        dispatch(requestLogin(loginData))
          .then(() => {
            const user = store.getState().auth;
            if (user.accessToken !== null) {
              success();
              setTimeout(() => navigate(`../${user.role == 3000 ? 'trungtamdangkiem' : 'cucdangkiem'}/${user.user}`), 700);
            } else {
              error();
            }
          })
          .catch(() => {
            error();
          });
      };


    return (
        // <div className={cx('wrapper')}>
        //     {contextHolder}
        //     <div className={cx('login')}>
        //         <h2 className={cx('active', 'h2tag')}> sign in </h2>
        //         <form className={cx('formtag')} onSubmit={handleSubmit}>
        //             <p className={cx('message')}>{respone.message}</p>
        //             <input type="text" className={cx('text', 'inputtag')} name="username" onChange={HandleUser} />
        //             <span className={cx('spantag')}>username</span>

        //             <br></br>

        //             <br></br>

        //             <input
        //                 type="password"
        //                 className={cx('text', 'inputtag')}
        //                 name="password"
        //                 onChange={HandlePassword}
        //             />
        //             <span className={cx('spantag')}>password</span>
        //             <br />

        //             <input type="checkbox" id="checkbox-1-1" className={cx('custom-checkbox')} onChange={handleCheckRole}/>
        //             <label className={cx('labeltag')} htmlFor="checkbox-1-1" >
        //                 Cục đăng kiểm
        //             </label>

        //             {/* //  onClick={e=>{e.stopPropagation();}}   */}
        //             <button className={cx('signin')} onClick={tmpLogin}>
        //                 Sign In
        //             </button>

        //             <hr className={cx('hrtag')} />

        //             <a className={cx('atag')} href="./ForgotPassword">
        //                 Forgot Password?
        //             </a>
        //         </form>
        //     </div>
        // </div>
        <>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%',
                        mt: 5
                    }}
                >
                    <div>
                        <Stack
                            spacing={1}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="h4" >
                                Đăng nhập
                            </Typography>
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                
                            </Typography>
                        </Stack>

                            <form
                                noValidate
                                onSubmit={dumb}
                            >
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        helperText={"Điền tên đăng nhập được cung cấp"}
                                        label="Tên đăng nhập"
                                        onChange={(e) => {setName(e.target.value)}}
                                        value={name}
                                    />
                                    <TextField
                                        fullWidth
                                        helperText={"Điền mật khẩu được cung cấp"}
                                        label="Mật khẩu"
                                        name="password"
                                        onChange={(e) => {setPass(e.target.value)}}
                                        type="password"
                                        value={pass}
                                    />
                                </Stack>
                                <FormControlLabel 
                                sx={{mt: 2 }}
                                control={<Checkbox  onChange={handleCheckRole}/>} label={
                                    <Typography color="text.secondary" variant="body2">
                                        Cục đăng kiểm
                                    </Typography>
                                }/>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    onClick={dumb}
                                >
                                    Tiếp tục
                                </Button>
                                <Button
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    href="/"
                                >
                                    Trở lại trang chủ
                                </Button>

                                <Alert
                                    color="primary"
                                    severity="info"
                                    sx={{ mt: 3 }}
                                >
                                    <div>
                                        Liên hệ phòng kỹ thuật để được hỗ trợ nếu chưa rõ thông tin
                                    </div>
                                </Alert>
                            </form>
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default Login;
