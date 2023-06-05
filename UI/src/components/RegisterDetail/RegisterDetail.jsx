import { Outlet } from "react-router-dom";
import styles from "./RegisterDetail.module.scss";
import classNames from 'classnames/bind';
import { useState } from "react";
import { SearchIcon, Close } from '~/components/Icons';
import { Stack, Typography } from "@mui/material";
const cx = classNames.bind(styles);
function RegisterDetail({ carInfor, setDisplayDetail, setCarInfor }) {

    // display detail

    const [carSend, setCarSend] = useState(null);
    const [isEditable, setisEditable] = useState(false);

    const handleClose = () => {
        setDisplayDetail(false);
    };
    const handleDelele = () => {
        //send requset
        console.log('delete', carInfor?.licensePlate);
        setDisplayDetail(false);
    };
    const handleisEditable = () => {
        if (isEditable == false) {
            setisEditable(!isEditable);
        }
        else {
            //send request
            setDisplayDetail(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "ownerName") {
            setCarInfor({
                ...carInfor,
                carOwner: {
                    ...carInfor.carOwner,
                    name: value,
                },
            });
        }
        else setCarInfor({
            ...carInfor,
            [name]: value,
        });
        console.log(carInfor)
        setCarSend({
            ...carSend,
            [name]: value,
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('icon_close')} onClick={handleClose}>
                    <Close width={'2.4rem'} height={'2.4rem'} />
                </div>

                <Typography variant="h4">
                    {`Thông tin đăng kiểm xe ${carInfor?.licensePlate}`}
                </Typography>
                <div className={cx('content')}>
                    <div className={cx('info')}>
                    <Typography variant="h6">
                    Hãng xe
                    </Typography>
                        <Typography
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            onInput={handleChange}
                            name="licensePlate"
                            value={`${carInfor?.licensePlate}`}
                        >
                            {`${carInfor?.licensePlate}`}
                        </Typography>
                    </div>

                    <div className={cx('info')}>
                        <Typography variant="h6">
                            Chủ sở hữu
                        </Typography>
                        <Typography
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="ownerName"
                            onInput={handleChange}
                            value={`${carInfor?.carOwner?.name}`}
                        >
                            {`${carInfor?.carOwner?.name}`}
                        </Typography>
                    </div>

                <div className={cx('info')}>
                    <Typography variant="h6">
                        Nơi đăng kiểm
                    </Typography>

                    <Typography
                        disabled={!isEditable}
                        className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                        name="regionName"
                        onInput={handleChange}
                        value={`${carInfor?.historyRegistrationInformation[0]?.regionName}`}
                    >
                        {`${carInfor?.historyRegistrationInformation[0]?.regionName}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                    <Typography variant="h6">
                    Trung tâm
                    </Typography>
                    <Typography
                        disabled={!isEditable}
                        className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                        name="regionName"
                        onInput={handleChange}
                        value={`${carInfor?.historyRegistrationInformation[0]?.trungTamDangKiemName}`}
                    >
                        {`${carInfor?.historyRegistrationInformation[0]?.trungTamDangKiemName}`}
                    </Typography>
                </div>

                <div className={cx('info')}>
                    <Typography variant="h6">
                    Hãng xe
                    </Typography>
                    
                    <Typography className={cx('input')} disabled={true} value={`${carInfor?.type ? "Mec" : "Xe cỏ"}`} >
                        {`${carInfor?.type ? "Mec" : "Xe cỏ"}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                <Typography variant="h6">
                    Dòng xe
                    </Typography>
                    <Typography
                        className={cx('input')}
                        disabled={true}
                        value={`${carInfor?.carSpecification?.type}`}
                    >
                        {`${carInfor?.carSpecification?.type}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                <Typography variant="h6">
                    Phiên bản
                    </Typography>
                    <Typography className={cx('input')} disabled={true} value={`${carInfor?.version}`} >
                        {`${carInfor?.version}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                <Typography variant="h6">
                    Ngày đăng ký
                    </Typography>
                    <Typography
                        className={cx('input')}
                        disabled={true}
                        value={`${carInfor?.historyRegistrationInformation[0]?.dateOfIssue.slice(0, 10)}`}
                    >
                        {`${carInfor?.historyRegistrationInformation[0]?.dateOfIssue.slice(0, 10)}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                <Typography variant="h6">
                    Ngày hết hạn
                    </Typography>
                    <Typography
                        className={cx('input')}
                        disabled={true}
                        value={`${carInfor?.historyRegistrationInformation[0]?.dateOfExpiry.slice(0, 10)}`}
                    >
                        {`${carInfor?.historyRegistrationInformation[0]?.dateOfExpiry.slice(0, 10)}`}
                    </Typography>
                </div>
                <div className={cx('info')}>
                <Typography variant="h6">
                    Xe công vụ
                    </Typography>
                    <Typography
                        disabled={isEditable}
                        className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                        value={carInfor?.carOwner?.organization == true ? "Có" : "Không"}

                    >{carInfor?.carOwner?.organization == true ? "Có" : "Không"}</Typography>
                </div>

            </div>
        </div>
        </div >

    );
}

export default RegisterDetail;