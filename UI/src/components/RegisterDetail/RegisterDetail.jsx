import { Outlet } from "react-router-dom";
import styles from "./RegisterDetail.module.scss";
import classNames from 'classnames/bind';
import { useState } from "react";
import { SearchIcon, Close } from '~/components/Icons';
const cx = classNames.bind(styles);
function RegisterDetail({carInfor,setDisplayDetail,setCarInfor}) {

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
        else  setCarInfor({
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
                    <div className={cx('title_info')}>{`Thông tin đăng kiểm xe ${carInfor?.licensePlate}`}</div>
                    <div className={cx('content')}>
                        <div className={cx('info')}>
                            Biển số xe
                            <p
                                disabled={!isEditable}
                                className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                                onInput={handleChange}
                                name="licensePlate"
                                value={`${carInfor?.licensePlate}`}
                            >
                                {`${carInfor?.licensePlate}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Chủ sở hữu
                            <p
                                disabled={!isEditable}
                                className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                                name="ownerName"
                                onInput={handleChange}
                                value={`${carInfor?.carOwner?.name}`}
                            >
                                {`${carInfor?.carOwner?.name}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Nơi đăng kiểm
                            <p
                                disabled={!isEditable}
                                className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                                name="regionName"
                                onInput={handleChange}
                                value={`${carInfor?.historyRegistrationInformation[0]?.regionName}`}
                            >
                                {`${carInfor?.historyRegistrationInformation[0]?.regionName}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Trung tâm đăng kiểm
                            <p
                                disabled={!isEditable}
                                className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                                name="regionName"
                                onInput={handleChange}
                                value={`${carInfor?.historyRegistrationInformation[0]?.trungTamDangKiemName}`}
                            >
                                {`${carInfor?.historyRegistrationInformation[0]?.trungTamDangKiemName}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Hãng xe
                            <p className={cx('input')} disabled={true} value={`${carInfor?.type ? "Mec":"Xe cỏ"}`} >
                            {`${carInfor?.type ? "Mec":"Xe cỏ"}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Dòng xe
                            <p
                                className={cx('input')}
                                disabled={true}
                                value={`${carInfor?.carSpecification?.type}`}
                            >
                                {`${carInfor?.carSpecification?.type}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Phiên bản
                            <p className={cx('input')} disabled={true} value={`${carInfor?.version}`} >
                            {`${carInfor?.version}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Ngày đăng kí
                            <p
                                className={cx('input')}
                                disabled={true}
                                value={`${carInfor?.historyRegistrationInformation[0]?.dateOfIssue.slice(0,10)}`}
                            >
                                {`${carInfor?.historyRegistrationInformation[0]?.dateOfIssue.slice(0,10)}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Ngày hết hạn
                            <p
                                className={cx('input')}
                                disabled={true}
                                value={`${carInfor?.historyRegistrationInformation[0]?.dateOfExpiry.slice(0,10)}`}
                            >
                                {`${carInfor?.historyRegistrationInformation[0]?.dateOfExpiry.slice(0,10)}`}
                            </p>
                        </div>
                        <div className={cx('info')}>
                            Xe công vụ
                            <p  
                                disabled={isEditable}
                                className={cx(`${isEditable === true ? 'edit' : ''}`,'input')}
                                value={carInfor?.carOwner?.organization == true ? "Có" : "Không"}

                            >{carInfor?.carOwner?.organization == true ? "Có" : "Không"}</p>
                        </div>
                       
                    </div>
                </div>
            </div>
            
        );
}

export default RegisterDetail;