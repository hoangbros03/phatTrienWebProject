import { Outlet ,useParams} from 'react-router-dom';
import styles from './newRegistry.module.scss';
import classNames from 'classnames/bind';
import React, { useState , useEffect} from 'react';
import * as API from '~/services/searchService';
import { Button, message, Space } from 'antd';
const cx = classNames.bind(styles);
function NewRegistry() {
    const [status, setStatus] = useState({ status: 'unsent' });
    const [messageFail,setMessageFail] = useState("");
    const [formtext, setFromtext] = useState({
        title1: { title: 'Biển số xe', sub: '99A 99999' },
        title8: { title: 'Ngày đăng kí', sub: '21/2/2023' },
        title9: { title: 'Ngày hết hạn', sub: '21/2/2024' },
    });
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useParams();
    const UserNameMapWithUser = new Map();
    useEffect(() => {
        const res = async () => {
            try {
                const response = await API.getList('http://localhost:3500/cucDangKiem/:user/center', {
                    user: user,
                });
                const dataArray = JSON.parse(response);
                dataArray.forEach(({ name, user }) => {
                    UserNameMapWithUser.set(user, name);
                });
                setCarRegister({ ...carRegister, trungTamDangKiemName: UserNameMapWithUser.get(user) });
               
            } catch (error) {
                console.error(error);
            }
        };
        res();
    }, []);
    const [carRegister, setCarRegister] = useState({
        licensePlate: '',
        dateOfIssue: '',
        dateOfExpiry: '',
    });
    const warningcondition = () => {
        messageApi.open({
            type: 'warning',
            content: 'Hãy nhập đúng biển số xe',
        });
    };
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type == 'date') {
            var date = new Date(value);
            const iso = date.toISOString();
            setCarRegister({ ...carRegister, [name]: iso });
        } else setCarRegister({ ...carRegister, [name]: value });
    };
    const handleBack = () => {
        setStatus({ ...status, status: 'unsent' });
    };
    const handleCheckConditionLicense = (e) => {
        const { name, value } = e.target;
        if (!value.match(/\d{2}[A-Z][-]*\d{3}[.]*\d{2}$/) && !value.match(/\d{2}[A-Z][-]*\d{4}$/)) {
            console.log(!value.match(/\d{2}[A-Z]-\d{3}.\d{2}$/), !value.match(/\d{2}[A-Z]-\d{4}$/));
            warningcondition();
            return;
        } else {
            if (value.match(/\d{2}[A-Z][-]*\d{3}[.]*\d{2}$/)) {
                e.target.value = value.replace(/^(\d{2}[A-Z])[-]*(\d{3})[.]*(\d{2})$/, '$1-$2.$3');
            } else {
                console.log(value.match(/\d{2}[A-Z][-]*\d{3}\d{2}$/));
                e.target.value = value.replace(/^(\d{2}[A-Z])(\d{4})$/, '$1-$2');
            }
            setCarRegister({ ...carRegister, [name]: e.target.value });
        }
    };
    const handleSubmit = async (e) => {
        console.log(carRegister);
        const response= await API.post_user("trungTamDangKiem/:user/newRegistry",{user:user},carRegister);
        console.log(response)
        if(response=="OK"){
            setStatus({...status,status:"success"})
        }else {setStatus({...status,status:"failure"})
        setMessageFail(response.status)}
    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        if (status.status == 'unsent')
            return (
                <div className={cx('container')}>
                    <form className={cx('form')}>
                        <div className={cx('title-signup')}>Thêm mẫu đăng kiểm mới</div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title1.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title1.sub}
                                    name="licensePlate"
                                    value={carRegister.licensePlate}
                                    onBlur={handleCheckConditionLicense}
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title8.title}</p>
                                <input
                                    type="date"
                                    className={cx('input')}
                                    placeholder={formtext.title8.sub}
                                    name="dateOfIssue"
                                    value={carRegister.dateOfIssue.slice(0,10)}
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title9.title}</p>
                                <input
                                    type="date"
                                    className={cx('input')}
                                    placeholder={formtext.title9.sub}
                                    name="dateOfExpiry"
                                    value={carRegister.dateOfExpiry.slice(0,10)}
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
                    <div className={cx('content')}>{`Đã đăng kiểm thành công Xe ${carRegister?.licensePlate}`}</div>
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
                    <div
                        className={cx('content')}
                    >{`Đã không thể đăng kiểm${carRegister?.licensePlate}`}</div>
                    <div
                        className={cx('content')}
                    >{`Có lẽ vì ${messageFail}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            {renderForm()}
            {renderSucess()}
            {renderFailure()}
        </div>
    );
}

export default NewRegistry;
