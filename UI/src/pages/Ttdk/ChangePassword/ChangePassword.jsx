import { Outlet, useParams } from 'react-router-dom';
import styles from './ChangePassword.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import * as API from '~/services/searchService';
import { Button, message, Space } from 'antd';
const cx = classNames.bind(styles);
function ChangePassword() {
    const [messageFail, setMessageFail] = useState('');
    const [formtext, setFromtext] = useState({
        title1: { title: 'Tên đăng nhập', sub: 'Username' },
        title2: { title: 'Mật khẩu cũ', sub: 'Password' },
        title3: { title: 'Mật khẩu mới', sub: 'NewPassword' },
        title4: { title: 'Nhập lại mật khẩu', sub: '' },
    });
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useParams();
    const [centerInfor, setCenterInfor] = useState({
        user: '',
        newPassword: '',
        oldPassword: '',
        checkPassword: '',
    });
    const warningcondition = () => {
        messageApi.open({
            type: 'warning',
            content: 'Hãy kiểm tra nhập lại mật khẩu',
        });
    };
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Bạn đã cập nhập mật khẩu thành công',
        });
    };
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type == 'date') {
            var date = new Date(value);
            const iso = date.toISOString();
            setCenterInfor({ ...centerInfor, [name]: iso });
        } else setCenterInfor({ ...centerInfor, [name]: value });
    };

    const warning = (text) => {
        messageApi.open({
            type: 'warning',
            content: text ,
        });
    };
    const handleSubmit = async (e) => {
        if (centerInfor.newPassword != centerInfor.checkPassword) {
            warningcondition();
            return;
        } else {
            const response = await API.post('http://localhost:3500/cucDangKiem/admin/center/changePassword', {
                ...centerInfor,
            });
            if (response == 'OK') {
                success();
            } else {
                
                warning(response.status);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            {contextHolder}

            <div className={cx('container')}>
                <form className={cx('form')}>
                    <div className={cx('title-signup')}>Đổi mật khẩu</div>
                    <div className={cx('signup-form')}>
                        <div className={cx('signup-div')}>
                            <p>{formtext.title1.title}</p>
                            <input
                                type="text"
                                className={cx('input')}
                                placeholder={formtext.title1.sub}
                                name="user"
                                value={centerInfor.user}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>

                        <div className={cx('signup-div')}>
                            <p>{formtext.title2.title}</p>
                            <input
                                type="password"
                                className={cx('input')}
                                placeholder={formtext.title2.sub}
                                name="oldPassword"
                                value={centerInfor.oldPassword}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                    </div>
                    <div className={cx('signup-form')}>
                        <div className={cx('signup-div')}>
                            <p>{formtext.title3.title}</p>
                            <input
                                type="password"
                                className={cx('input')}
                                placeholder={formtext.title3.sub}
                                name="newPassword"
                                value={centerInfor.newPassword}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>

                        <div className={cx('signup-div')}>
                            <p>{formtext.title4.title}</p>
                            <input
                                type="password"
                                className={cx('input')}
                                placeholder={formtext.title4.sub}
                                name="checkPassword"
                                value={centerInfor.checkPassword}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                    </div>

                    <div className={cx('signup-form')}>
                        <div className={cx('submit')} onClick={handleSubmit}>
                            Xác Nhận
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
