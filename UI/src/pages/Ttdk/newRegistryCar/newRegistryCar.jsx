import { Outlet, useParams } from 'react-router-dom';
import styles from './newRegistryCar.module.scss';
import classNames from 'classnames/bind';
import * as API from '~/services/searchService';
import InputSuggest from '~/components/InputSuggest/InputSuggest';
import React, { useState, useEffect, version } from 'react';
import { message, Space } from 'antd';
import { Autocomplete, TextField, Typography, FormControlLabel, Checkbox, Button, Alert } from '@mui/material';
const cx = classNames.bind(styles);
function NewRegistryCar() {
    const [status, setStatus] = useState({ status: 'unsent' });
    const [messageFail, setMessageFail] = useState("")
    const [formtext, setFromtext] = useState({
        title1: { title: 'Biển số xe', sub: '99A-99999' },
        title2: { title: 'Người sở hữu', sub: 'Trần Bá Hoàng' },
        title3: { title: 'Tỉnh', sub: 'Quảng Ninh' },
        title4: { title: 'Kiểu xe', sub: 'Sport' },
        title5: { title: 'Loại xe ', sub: 'Xe tải' },
        title6: { title: 'Số máy', sub: '19SS46' },
        title7: { title: 'Số khung', sub: '99911' },
        title8: { title: 'Ngày đăng kí', sub: '21/2/2023' },
        title9: { title: 'Tên xe', sub: 'Wave' },
        title10: { title: 'Số căn cước', sub: '0272025411' },
        title11: { title: 'Xe công vụ', sub: 'Có' },
    });
    const [carRegister, setCarRegister] = useState({
        licensePlate: '',
        ownerName: '',
        regionName: '',
        engineNo: '',
        classisNo: '',
        carType: '',
        carName: '',
        dateOfIssue: '2023-6-11',
        ID: '',
        carVersion: '',
        trungTamDangKiemName: '',
        organization: false,
    });
    const { user } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const provinces = [
        'Hà Nội',
        'Vĩnh Phúc',
        'Bắc Ninh',
        'Quảng Ninh',
        'Hải Dương',
        'Hải Phòng',
        'Hưng Yên',
        'Thái Bình',
        'Hà Nam',
        'Nam Định',
        'Ninh Bình',
        'Thanh Hóa',
        'Nghệ An',
        'Hà Tĩnh',
        'Quảng Bình',
        'Quảng Trị',
        'Thừa Thiên Huế',
        'Đà Nẵng',
        'Quảng Nam',
        'Quảng Ngãi',
        'Bình Định',
        'Phú Yên',
        'Khánh Hòa',
        'Ninh Thuận',
        'Bình Thuận',
        'Kon Tum',
        'Gia Lai',
        'Đắk Lắk',
        'Đắk Nông',
        'Lâm Đồng',
        'Bình Phước',
        'Tây Ninh',
        'Bình Dương',
        'Đồng Nai',
        'Bà Rịa - Vũng Tàu',
        'Hồ Chí Minh',
        'Long An',
        'Tiền Giang',
        'Bến Tre',
        'Trà Vinh',
        'Vĩnh Long',
        'Đồng Tháp',
        'An Giang',
        'Kiên Giang',
        'Cần Thơ',
        'Hậu Giang',
        'Sóc Trăng',
        'Bạc Liêu',
        'Cà Mau',
        'Lào Cai',
        'Yên Bái',
        'Điện Biên',
        'Hoà Bình',
        'Lai Châu',
        'Sơn La',
        'Hà Giang',
        'Cao Bằng',
        'Tuyên Quang',
        'Thái Nguyên',
        'Lạng Sơn',
        'Bắc Kạn',
        'Bắc Giang',
        'Phú Thọ',
        'Điện Biên Phủ',
    ];

    //handle set specific car
    const [dataCarSpecific, setDataCarSpecific] = useState([]);
    const [dataCarSpecificName, setDataCarSpecificName] = useState([]);
    const [dataCarSpecificVersion, setDataCarSpecificVersion] = useState([]);
    const [dataCarSpecificType, setDataCarSpecificType] = useState([]);
    const setCarParameter = (value) => {
        const carObject = dataCarSpecific.find((car) => car.name === value);
        setCarRegister({ ...carRegister, carName: carObject.name, carVersion: carObject.version, carType: carObject.type })
    };

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
                const response2 = await API.getList('http://localhost:3500/trungtamdangkiem/:user/getSpecificCar', {
                    user: user,
                });
                const SpecificCar = JSON.parse(response2);
                var tempArray = [];
                var tempArrayName = [];
                var tempArrayVersion = [];
                var tempArrayType = [];
                SpecificCar.forEach(({ name, version, type }) => {
                    tempArray.push({ name, version, type });
                    tempArrayName.push(name);
                    tempArrayVersion.push(version);
                    tempArrayType.push(type);
                });
                setCarRegister({ ...carRegister, trungTamDangKiemName: UserNameMapWithUser.get(user) });
                console.log(tempArray);
                setDataCarSpecific(tempArray);
                setDataCarSpecificName([...new Set(tempArrayName)]);
                setDataCarSpecificVersion([...new Set(tempArrayVersion)]);
                setDataCarSpecificType([...new Set(tempArrayType)]);
            } catch (error) {
                console.error(error);
            }
        };
        res();
    }, []);
    //information alert
    const warningfill = () => {
        messageApi.open({
            type: 'warning',
            content: 'Hãy điền đầy đủ thông tin yêu cầu',
        });
    };
    const warningprovince = () => {
        messageApi.open({
            type: 'warning',
            content: 'Hãy nhập đúng tên tỉnh',
        });
    };
    const warningcondition = () => {
        messageApi.open({
            type: 'warning',
            content: 'Hãy nhập đúng biển số xe',
        });
    };
    const duplicater = () => {
        messageApi.open({
            type: 'error',
            content: 'Tài khoản hoặc tên trung tâm đã được sử dụng',
        });
    };
    const handleStandardized = (e) => {
        e.target.value = e.target.value
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        if (e.target.name == 'regionName') checkProvince(e);

        setCarRegister({ ...carRegister, [e.target.name]: e.target.value });
    };

    const checkProvince = (e) => {
        const check = e.target.value.toLowerCase();
        const res = provinces.filter((province) => {
            return province.toLowerCase() == check;
        });
        if (res.length > 0) return;
        else warningprovince();
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e?.nativeEvent?.target || {};
        if (type == 'date') {
            console.log(value)
            if (value.length == 0);
            else {
                var date = new Date(value);
                const iso = date.toISOString();
                setCarRegister({ ...carRegister, [name]: iso });
            }
        }
        if (name == "organization") {
            setCarRegister({ ...carRegister, [name]: checked })
        }
        else setCarRegister({ ...carRegister, [name]: value });
    }
    const handleBlur = (e) => {
        const { name, value, type } = e?.nativeEvent?.target || {};
        if (type == 'date') {
            console.log(value)
            if (value.length == 0);
            else {
                var date = new Date(value);
                const iso = date.toISOString();
                setCarRegister({ ...carRegister, [name]: iso });
            }
        } else
            setCarRegister({ ...carRegister, [name]: value });
    };
    const handleBack = () => {
        setStatus({ ...status, status: 'unsent' });
    };

    const handleCheck = (e) => {
        setCarRegister({ ...carRegister, organization: e.target.checked });
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
        const response = await API.post_user("trungTamDangKiem/:user/createCar", { user: user }, { ...carRegister })
        if (response.status == "success") setStatus({ ...status, status: "success" })
        else {
            setStatus({ ...status, status: "failure" });
            console.log(response)
            console.log(response.status)
            setMessageFail(response.status)
        }
    };
    const renderForm = () => {
            return (
                <div className={cx('container')}>
                    <form className={cx('form')}>
                        <Typography variant='h4' color="primary"  mb={3}>
                            Đăng ký phương tiện mới
                        </Typography>

                        <Typography color="black" variant='h6' mb={1}>
                            Điền thông tin đăng ký
                        </Typography>

                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <TextField
                                    type="text"
                                    autoComplete='off'
                                    label={formtext.title1.title}
                                    name="licensePlate"
                                    value={carRegister.licensePlate}
                                    onBlur={handleCheckConditionLicense}
                                    onChange={handleChange}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></TextField>
                            </div>
                            <div className={cx('signup-div')}>
                                <TextField
                                    label={formtext.title2.title}
                                    type="text"
                                    autoComplete='off'
                                    value={carRegister.ownerName}
                                    name="ownerName"
                                    onBlur={handleStandardized}
                                    onChange={handleChange}
                                //required
                                sx={{
                                    width: "100%",
                                    marginBottom: 2,
                                    marginTop: 2
                                }}
                                ></TextField>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <TextField
                                    label={formtext.title10.title}
                                    type="text"
                                    value={carRegister.ID}
                                    name="ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></TextField>
                            </div>
                            <div className={cx('signup-div')}>
                                <Autocomplete
                                    options={dataCarSpecificName}
                                    onChange={(event, newValue) => {
                                        setCarParameter(newValue)
                                    }}
                                    name="carName"
                                    value={carRegister.carName}
                                    onBlur={handleBlur}
                                    renderInput={(params) => <TextField {...params} label={formtext.title9.title} />}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                >

                                </Autocomplete>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <TextField
                                    label={formtext.title8.title}
                                    type="date"
                                    name="dateOfIssue"
                                    value={carRegister.dateOfIssue.slice(0, 10)}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></TextField>
                            </div>
                            <div className={cx('signup-div')}>
                                <Autocomplete
                                    type="text"
                                    options={provinces}
                                    value={carRegister.regionName}
                                    name="regionName"
                                    onBlur={handleStandardized}
                                    onChange={
                                        (event, newValue) => {
                                            setCarRegister({ ...carRegister, regionName: newValue })
                                        }
                                    }
                                    renderInput={(params) => <TextField {...params} label="Khu vực" />}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></Autocomplete>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <Autocomplete
                                    label={formtext.title4.title}
                                    autoComplete="off"
                                    options={dataCarSpecificVersion}
                                    name="carVersion"
                                    onBlur={handleBlur}
                                    value={carRegister.carVersion}
                                    onChange={
                                        (event, newValue) => {
                                            setCarRegister({ ...carRegister, carVersion: newValue })
                                        }
                                    }
                                    renderInput={(params) => <TextField {...params} label="Phiên bản" />}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                >
                                </Autocomplete>
                            </div>
                            <div className={cx('signup-div')}>
                                <Autocomplete
                                    autoComplete="off"
                                    options={dataCarSpecificType}
                                    name="carType"
                                    onBlur={handleBlur}
                                    value={carRegister.carType}
                                    onChange={
                                        (event, newValue) => {
                                            setCarRegister({ ...carRegister, carType: newValue })
                                        }
                                    }
                                    renderInput={(params) => <TextField {...params} label="Loại xe" />}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                >
                                    {formtext.title5.sub}
                                </Autocomplete>
                            </div>
                            <div className={cx('signup-div')}>
                                <TextField
                                    type="text"
                                    label={formtext.title6.title}
                                    autoComplete='off'
                                    value={carRegister.engineNo}
                                    name="engineNo"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></TextField>
                            </div>
                            <div className={cx('signup-div')}>
                                <TextField
                                    label={formtext.title7.title}
                                    value={carRegister.classisNo}
                                    name="classisNo"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                //required
                                ></TextField>
                            </div>
                            <div className={cx('signup-div')}>
                                <FormControlLabel
                                    control={<Checkbox
                                        onChange={handleCheck}
                                        checked={carRegister.organization} />}
                                    label={formtext.title11.title}
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                        marginTop: 2
                                    }}
                                    />
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
            );
        };


    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            {renderForm()}
        </div>
    );
}

export default NewRegistryCar;
