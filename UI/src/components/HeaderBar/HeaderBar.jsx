import './HeaderBar.scss';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import navLogo from '../../assets/images/Logo.png';
import { DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
//set local set
import { setAccessToken, requestLogout } from '../../auth/Auth';
import { useEffect, useState } from 'react';
import * as API from '~/services/Auth';
import { useDispatch, useSelector } from 'react-redux';

import { alpha } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Toolbar,
    Tooltip,
    useMediaQuery,
    Button
} from '@mui/material';

// function Header({ user }) {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [loggedIn, setLoggedIn] = useState({ loggedIn: false, role: '', user: '' });
//     useEffect(() => {
//         (async () => {
//             const response = await API.refresh('/refresh');
//             if (response?.accessToken == null) {
//             } else {
//                 await dispatch(setAccessToken(response));
//                 setLoggedIn({ ...loggedIn, loggedIn: true, role: response.role, user: response.user });
//                 return;
//             }
//         })();
//     }, []);
//     const handleLogout = async () => {
//         console.log("KKK")
//         await dispatch(requestLogout())
//     }
//     const items = [
//         {
//             key: '1',
//             label: <a href="../../../" onClick={handleLogout}>Đăng xuất</a>,
//         },
//     ];
//     return (
//         <nav>
//             <ul>
//                 <li id="logo">
//                     <img src={navLogo} alt="logo" />
//                 </li>
//                 {/* <li><a href=".">Trang chủ</a></li> */}
//                 {user ? null : (
//                     <li>
//                         <NavLink to="/">Trang chủ</NavLink>
//                     </li>
//                 )}
//                 {user ? null : (
//                     <li>
//                         <NavLink to="/contact">Liên hệ</NavLink>
//                     </li>
//                 )}
//                 {user ? null : (
//                     <li>
//                         <NavLink to="/about">Giới thiệu</NavLink>
//                     </li>
//                 )}
//                 <li id="signup" className="button">
//                     <a></a>
//                 </li>
//                 {user && loggedIn.loggedIn ? (
//                     <Dropdown
//                         className="button"
//                         menu={{
//                             items,
//                         }}
//                     >
//                         <a onClick={(e) => e.preventDefault()}>
//                             <Space>
//                                 <Avatar size={48} icon={<UserOutlined />} />
//                                 <DownOutlined />
//                             </Space>
//                         </a>
//                     </Dropdown>
//                 ) : null}
//                 {loggedIn.loggedIn && !user ? (
//                     <li id="login" className="button">
//                         {' '}
//                         <a
//                             onClick={() => {
//                                 navigate(
//                                     `${loggedIn.role == 3000 ? 'trungtamdangkiem' : 'cucdangkiem'}/${loggedIn.user}`,
//                                 );
//                             }}
//                         >
//                             Trở lại
//                         </a>
//                     </li>
//                 ) : null}
//                 {!user && !loggedIn.loggedIn ? (
//                     <li id="login" className="button" >
//                         {' '}
//                         <a href="/login">Đăng nhập</a>
//                     </li>
//                 ) : null}

//             </ul>
//         </nav>
//     );
// }

function HeaderBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState({ loggedIn: false, role: '', user: '' });

    useEffect(() => {
        (async () => {
            const response = await API.refresh('/refresh');
            if (response?.accessToken == null) {
            } else {
                await dispatch(setAccessToken(response));
                setLoggedIn({ ...loggedIn, loggedIn: true, role: response.role, user: response.user });
                return;
            }
        })();
    }, []);

    const handleLogout = async () => {
        console.log("KKK")
        await dispatch(requestLogout())
    }

    const navHeight = 64;
    const navWidth = 240;

    return (
        <Box
            component="header"
            sx={{
                backdropFilter: 'blur(6px)',
                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
                position: 'static',
                left: {
                    lg: `${navWidth}px`
                },
                top: 0,
                // width: {
                //     lg: `calc(100% - ${navWidth}px)`
                // },
                zIndex: (theme) => theme.zIndex.appBar
            }}
        >
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{
                    minHeight: navHeight,
                    px: 2
                }}
            >

                {loggedIn.user ? (
                    <img src={navLogo} alt='logo' style={{
                        height: 50,
                        marginRight: 40,
                        marginLeft: 100
                    }}></img>
                ) : (
                    <Toolbar>
                        <img src={navLogo} alt='logo' style={{
                            height: 50,
                            marginRight: 40,
                            marginLeft: 100
                        }}></img>

                        <Link to="/">
                            <Button variant="text">Trang chủ</Button>
                        </Link>

                        <Link to="/about">
                            <Button variant="text">Giới thiệu</Button>
                        </Link>

                        <Link to="/contact">
                            <Button variant="text">Liên hệ</Button>
                        </Link>
                    </Toolbar>
                )}

                {!loggedIn.user && !loggedIn.loggedIn ? (
                    <Link to="/login">
                        <Button variant="contained" sx={{
                            borderRadius: '5px',
                            mx: 10
                        }}>Đăng nhập</Button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <Button variant="text" onClick={handleLogout} href="/login" sx={{
                            borderRadius: '5px',
                            mx: 10
                        }}>Đăng xuất</Button>
                    </Link>
                )}
            </Stack>
        </Box>
    );

}

export default HeaderBar;
