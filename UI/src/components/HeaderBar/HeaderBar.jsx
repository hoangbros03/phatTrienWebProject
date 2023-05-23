import './HeaderBar.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import navLogo from '../../assets/images/navLogo.png';
import { DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
//set local set
import { setAccessToken, requestLogout } from '../../auth/Auth';
import { useEffect, useState } from 'react';
import { Dropdown, Avatar, Space } from 'antd';
import * as API from '~/services/Auth';
import { useDispatch, useSelector } from 'react-redux';
function Header({ user }) {
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
        console.log('KKK');
        await dispatch(requestLogout());
    };
    const items = [
        {
            key: '1',
            label: (
                <a href="../../../" onClick={handleLogout}>
                    Đăng xuất
                </a>
            ),
        },
    ];
    return (
        <nav>
            <ul className="navbar">
                <li id="logo">
                    <img src={navLogo} alt="logo" />
                </li>
                {/* <li><a href=".">Trang chủ</a></li> */}
                {user ? null : (
                    <li>
                        <NavLink to="/">Trang chủ</NavLink>
                    </li>
                )}
                {user ? null : (
                    <li>
                        <NavLink to="/contact">Liên hệ</NavLink>
                    </li>
                )}
                {user ? null : (
                    <li>
                        <NavLink to="/about">Giới thiệu</NavLink>
                    </li>
                )}
                <li id="signup" className="button">
                    <a></a>
                </li>
                {user && loggedIn.loggedIn ? (
                    <Dropdown
                        className="button"
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar size={48} icon={<UserOutlined />} />
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                ) : null}
                {loggedIn.loggedIn && !user ? (
                    <li id="login" className="button">
                        {' '}
                        <a
                            onClick={() => {
                                navigate(
                                    `${loggedIn.role == 3000 ? 'trungtamdangkiem' : 'cucdangkiem'}/${loggedIn.user}`,
                                );
                            }}
                        >
                            Trở lại
                        </a>
                    </li>
                ) : null}
                {!user && !loggedIn.loggedIn ? (
                    <li id="login" className="button">
                        {' '}
                        <a href="/login">Đăng nhập</a>
                    </li>
                ) : null}
            </ul>
        </nav>
    );
}

export default Header;
