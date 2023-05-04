import './HeaderBar.scss';
import { NavLink } from 'react-router-dom';
import navLogo from '../../assets/images/navLogo.png';
import { DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';

import { Dropdown, Avatar, Space } from 'antd';
function Header({ user }) {
    const items = [
        {
            key: '1',
            label: (
                <a href="../../../">
                    Đăng xuất
                </a>
            ),
        },
       
    ];
    return (
        <nav>
            <ul>
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
                {user ? (
                    <Dropdown className="button"
                        menu={{
                            items,
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar size={48} icon={<UserOutlined />} />
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                ) : (
                    <li id="login" className="button">
                        {' '}
                        <a href="login">Đăng nhập</a>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Header;
