import { Outlet } from 'react-router-dom';
import styles from './registerCenter.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);
function RegisterCenter() {
    const [status, setStatus] = useState({ status: 'success' });
    const [formtext, setFromtext] = useState({
        title1: { title: 'Tên Trung Tâm', sub: 'Trung tâm Âu Lạc' },
        title2: { title: 'Tên tài khoản', sub: 'Ttdk9999' },
        title3: { title: 'Mật khẩu', sub: 'password' },
        title4: { title: 'Nhập lại mật khẩu', sub: 'confirm password' },
        title5: { title: 'Địa chỉ', sub: 'Hà Nội' },
        title6: { title: 'Số điện thoại ', sub: '0986924536' },
    });
    const [registerCenter, setRegisterCenter] = useState({
        user: '',
        password: '',
        regionName: '',
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        //setRegisterCenter({ ...registerCenter, [name]: value });
    };

    const handleStandardized = (e) => {
        e.target.value = e.target.value
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };
    const handleBack = () => {
        setStatus({...status,status:'unsent'});
       
    };

    const handleSubmit = (e) => {
        const inputs = document.querySelectorAll('input[required]');

        let isValid = true;
        let centerTmp = {};
        inputs.forEach((input) => {
            let { name, value } = input;
            if (name != '') centerTmp = { ...centerTmp, [name]: value };

            if (!input.value.trim()) {
                isValid = false;
            }
        });
        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }
        //check resgister password
        if (inputs[2].value.length < 6) {
            alert('Password need at least 6 character');
            return;
        }

        if (inputs[2].value != inputs[3].value) {
            alert('Please fill password correct');
            return;
        } else {
            inputs.forEach((input) => {
                setRegisterCenter(centerTmp);
                input.value = '';
            });
            //send request to Back end
        }
    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        if (status.status == 'unsent')
            return (
                <div className={cx('container')}>
                    <form className={cx('form')}>
                        <div className={cx('title-signup')}>Đăng kí trung tâm</div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title1.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title1.sub}
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleStandardized}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title2.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title2.sub}
                                    name="user"
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
                                    name="password"
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
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title5.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    name="regionName"
                                    placeholder={formtext.title5.sub}
                                    onChange={handleChange}
                                    onBlur={handleStandardized}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title6.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title6.sub}
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
            );
        else return null;
    };

    const renderSucess = () => {
        if (status.status == 'success')
            return (
                <div className={cx('container', 'success', 'respone')}>
                    <div className={cx('title')}>Thành Công</div>
                    <div className={cx('content')}>{`Đã Đăng kí thành công  ${registerCenter?.name}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    const renderFailure = () => {
        if (status.status == 'failure')
            return (
                <div className={cx('container', 'failure', 'respone')}>
                    <div className={cx('title')}>Có lỗi đã xảy ra</div>
                    <div className={cx('content')}>{`Đã không thể Đăng kí thành công ${registerCenter?.name}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    
    return (
        <div className={cx('wrapper')}>
            {renderForm()}
            {renderSucess()}
            {renderFailure()}
        </div>
    );
}

export default RegisterCenter;
