import { Outlet, useParams } from 'react-router-dom';
import styles from './newRegistryCar.module.scss';
import classNames from 'classnames/bind';
import * as API from '~/services/searchService';
import InputSuggest from '~/components/InputSuggest/InputSuggest';
import React, { useState, useEffect, version } from 'react';
import { Button, message, Space } from 'antd';
const cx = classNames.bind(styles);
function NewRegistryCar() {
    const [status, setStatus] = useState({ status: 'unsent' });
    const [messageFail,setMessageFail] = useState("")
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
        dateOfIssue: '',
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
        setCarRegister({...carRegister,carName:carObject.name,carVersion:carObject.version,carType:carObject.type})   
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
    const handleChange=(e)=>{
        const { name, value, type } = e?.nativeEvent?.target || {};
        if (type == 'date') {
            console.log(value)
            if(value.length==0) ;
            else {
            var date = new Date(value);
            const iso = date.toISOString();
            setCarRegister({ ...carRegister, [name]: iso });}
        } else 
         setCarRegister({ ...carRegister, [name]: value });
    }
    const handleBlur = (e) => {
        const { name, value, type } = e?.nativeEvent?.target || {};
        if (type == 'date') {
            console.log(value)
            if(value.length==0) ;
            else {
            var date = new Date(value);
            const iso = date.toISOString();
            setCarRegister({ ...carRegister, [name]: iso });}
        } else 
        setCarRegister({ ...carRegister, [name]: value });
    };
    const handleBack = () => {
        setStatus({ ...status, status: 'unsent' });
    };

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setCarRegister({ ...carRegister, [name]: !!checked });
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
       

        // const response = await API.post_user("trungTamDangKiem/:user/createCar",{user:user},{...carRegister})
        // if(response.status=="success") setStatus({...status,status:"success"})
        // else {setStatus({...status,status:"failure"});
        // console.log(response)
        // console.log(response.status)
        //     setMessageFail(response.status)
        //         }
    };
    const renderForm = () => {
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
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title1.sub}
                                    name="licensePlate"
                                    value={carRegister.licensePlate}
                                    onBlur={handleCheckConditionLicense}

                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title2.title}</p>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title2.sub}
                                    value={carRegister.ownerName}
                                    name="ownerName"
                                    onBlur={handleStandardized}

                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title10.title}</p>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title10.sub}
                                    value={carRegister.ID}
                                    name="ID"
                                    onBlur={handleBlur}
                            
                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title9.title}</p>

                                <InputSuggest
                                    input
                                    autoComplete="off"
                                    data={dataCarSpecificName}
                                    onClick={setCarParameter}
                                    name="carName"
                                    value={carRegister.carName}
                                    ChangeData={handleBlur}
                                >
                                    {formtext.title9.sub}
                                </InputSuggest>
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
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title3.title}</p>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title3.sub}
                                    value={carRegister.regionName}
                                    name="regionName"
                                    onBlur={handleStandardized}
                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title4.title}</p>
                                <InputSuggest
                                    input
                                    autoComplete="off"
                                    data={dataCarSpecificVersion}
                                    name="carVersion"
                                    ChangeData={handleBlur}
                                    value={carRegister.carVersion}
                                >
                                    {formtext.title4.sub}
                                </InputSuggest>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title5.title}</p>
                                <InputSuggest
                                    input
                                    autoComplete="off"
                                    data={dataCarSpecificType}
                                    name="carType"
                                    ChangeData={handleBlur}
                                    value={carRegister.carType}
                                >
                                    {formtext.title5.sub}
                                </InputSuggest>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title6.title}</p>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title6.sub}
                                    value={carRegister.engineNo}
                                    name="engineNo"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title7.title}</p>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className={cx('input')}
                                    placeholder={formtext.title7.sub}
                                    value={carRegister.classisNo}
                                    name="classisNo"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    //required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title11.title}</p>
                                <input
                                    type="Checkbox"
                                    className={cx('input')}
                                    checked={carRegister.organization}
                                    name="organization"
                                    onBlur={handleCheck}
                                    onChange={handleChange}
                                    //required
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
                    <div className={cx('content')}>{`Đã Đăng kí thành công Xe ${carRegister?.licensePlate}`}</div>
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
                    >{`Đã không thể Đăng kí thành công Trung tâm đăng kiểm${carRegister?.licensePlate}`}</div>
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

export default NewRegistryCar;
