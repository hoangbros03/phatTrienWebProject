import { Outlet } from 'react-router-dom';
import styles from './newRegistry.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
const cx = classNames.bind(styles);
function NewRegistry() {
    const [ttdk, setTtdk] = useState({
        name: '',
        username: '',
        password: '',
        checkpassword: '',
        email: '',
        phone: '',
        brief: '',
    });
    const [status, setStatus] = useState({ status: 'unsent' });

    const [formtext,setFromtext]=useState({title1:{title:"Biển số xe",sub:"99A 99999"},
    title2:{title:"Tên hãng xe-dòng xe",sub:"Mercerdes Mayback"},
    title3:{title:"Phiên Bản",sub:"S450"},
    title4:{title:"Số chỗ",sub:"4"},
    title5:{title:"Chiều dài",sub:"5.462m"},
    title6:{title:"Chiều cao",sub:"1.5m"},
    title7:{title:"Công suất",sub:"270kW"},
    title8:{title:"Xem thông tin chủ xe"}})
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTtdk({ ...ttdk, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(ttdk);
    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        if (status.status == 'unsent')
            return (
                <div className={cx('container')}>
                    <div className={cx('form')}>
                        <div className={cx('title-signup')}>Thêm mẫu đăng kiểm mới</div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title1.title}</p>
                                <input type="text" className={cx('input')}  placeholder={formtext.title1.sub}></input>
                            </div>
                           
                        </div>
                        <div className={cx('signup-form')}>
                           
                            <div className={cx('signup-div')}>
                                <p>{formtext.title2.title}</p>
                                <input type="text" className={cx('input')} placeholder={formtext.title2.sub}></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title3.title}</p>
                                <input type="text" className={cx('input')} placeholder={formtext.title3.sub}></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title4.title}</p>
                                <input type="text" className={cx('input')} placeholder={formtext.title4.sub}></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title5.title}</p>
                                <input type="text" className={cx('input')} placeholder={formtext.title5.sub}></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title6.title}</p>
                                <input type="text" className={cx('input')} placeholder={formtext.title6.sub} ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title7.title}</p>
                                <input type="text" className={cx('input')}  placeholder={formtext.title7.sub}></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('submit')}>
                                Xác Nhận 
                            </div>
                            <div className={cx('option')}>
                                Thông tin chủ xe
                            </div>
                        </div>
                    </div>
                </div>
            );
        else return null;
    };

    const renderSucess = () => {
        if (status.status == 'sucess')
            return (
                <div className={cx('container', 'sucess', 'respone')}>
                    <div className={cx('title')}>Thành Công</div>
                    <div className={cx('content')}>{`Đã Đăng kí thành công Trung tâm đăng kiểm ${ttdk.name}`}</div>
                </div>
            );
        else return null;
    };
    const renderFailure = () => {
        if (status.status == 'failure')
            return (
                <div className={cx('container', 'failure', 'respone')}>
                    <div className={cx('title')}>Có lỗi đã xảy ra</div>
                    <div
                        className={cx('content')}
                    >{`Đã không thể Đăng kí thành công Trung tâm đăng kiểm ${ttdk.name}`}</div>
                </div>
            );
        else return null;
    };
    return (
        <div className={cx('wrapper')}>
            {renderForm()}
            {/* {renderSucess()}
            {renderFailure()} */}
        </div>
    );
}

export default NewRegistry;
