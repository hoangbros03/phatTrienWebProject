import { Outlet, useParams } from 'react-router-dom';
import styles from './newRegistry.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import * as API from '~/services/searchService';
import { message, Space } from 'antd';
import { TextField, Button, Typography, Alert, AlertTitle } from '@mui/material';
const cx = classNames.bind(styles);

function NewRegistry() {
    const [status, setStatus] = useState({ status: 'unsent' });
    const [messageFail, setMessageFail] = useState("");
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
        dateOfIssue: '2023-6-11',
        dateOfExpiry: '2024-6-11',
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
        const response = await API.post_user("trungTamDangKiem/:user/newRegistry", { user: user }, carRegister);
        console.log(response)
        if (response == "OK") {
            setStatus({ ...status, status: "success" })
        } else {
            setStatus({ ...status, status: "failure" })
            setMessageFail(response.status)
        }
    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        return (
            <div className={cx('container')}>
                <form className={cx('form')}>
                    <Typography color="primary"  variant="h4">
                        Thêm mẫu đăng kiểm mới
                    </Typography>
                    <div className={cx('signup-form')}>
                        <div className={cx('signup-div')}>
                            <Typography color="black" variant="h6" mb={3}>
                                Điền thông tin đăng kiểm
                            </Typography>
                            <TextField
                                type="text"
                                name="licensePlate"
                                label={formtext.title1.title}
                                value={carRegister.licensePlate}
                                onBlur={handleCheckConditionLicense}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '100%'
                                }}
                            ></TextField>
                        </div>
                    </div>
                    <div className={cx('signup-form')}>
                        <div className={cx('signup-div')}>
                            <TextField
                                id="dateOfIssue"
                                type="date"
                                name="dateOfIssue"
                                value={carRegister.dateOfIssue.slice(0, 10)}
                                label={formtext.title8.title}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '90%'
                                }}
                            ></TextField>
                        </div>
                        <div className={cx('signup-div')}>
                            <TextField
                                type="date"
                                label={formtext.title9.title}
                                placeholder={formtext.title9.sub}
                                name="dateOfExpiry"
                                value={carRegister.dateOfExpiry.slice(0, 10)}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '90%',
                                    marginLeft: '10%'
                                }}
                            ></TextField>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px" }}> {status.status == "unsent" ? null : status.status == "failure" ? (
                        <Alert severity="error" color="error">
                            {`Lỗi! ${messageFail}`}
                        </Alert>)
                        : (
                            <Alert severity="info" >
                                {`Đã đăng kiểm thành công Xe ${carRegister?.licensePlate}`}
                            </Alert>
                        )
                    }
                    </div>
                    <div className={cx('signup-form')}>
                        {status.status != "success" ? (
                            <Button onClick={handleSubmit}
                                sx={{
                                    marginTop: "30px"
                                }}
                                size="large"
                            >
                                Xác nhận
                            </Button>
                        ) : (
                            <Button onClick={handleBack}
                                sx={{
                                    marginTop: "30px"
                                }}
                                size="large"
                            >
                                Đăng kiểm lại
                            </Button>
                        )}

                    </div>

                </form>
            </div>
        )
    }

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            {renderForm()}
        </div>
    );
}

export default NewRegistry;
