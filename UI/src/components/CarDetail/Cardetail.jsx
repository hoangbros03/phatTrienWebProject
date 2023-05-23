import { Outlet, useParams } from 'react-router-dom';
import styles from './Cardetail.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import { SearchIcon, Close } from '~/components/Icons';
import { message, Popover, Button } from 'antd';
import * as API from '~/services/searchService';
const cx = classNames.bind(styles);
function CarDetail({ carInfor, setDisplayDetail, setCarInfor }) {
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useParams();
    // display detail
    const successDelete = () => {
        messageApi.open({
            type: 'success',
            content: 'Bạn đã xóa thành công tin xe',
        });
    };
    const successUpdate = () => {
        messageApi.open({
            type: 'success',
            content: 'Bạn đã cập nhật thông tin xe thành công',
        });
    };
    const failUpdate = () => {
        messageApi.open({
            type: 'error',
            content: 'Bạn đã cập nhật thông tin xe không thành công vui lòng nhập lai thông tin',
        });
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
                setCarUpdate({ ...carUpdate, trungTamDangKiemName: UserNameMapWithUser.get(user) });
            } catch (error) {
                console.error(error);
            }
        };
        res();
    }, []);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const delete_ = async () => {
        const respone = await API.Delete(
            'trungTamDangKiem/:user/deleteCar',
            { user: user },
            { licensePlate: carInfor.licensePlate },
        );
        console.log(respone);
        successDelete();
        setOpenDelete(false);
        setTimeout(() => {
            setDisplayDetail(false);
        }, 700);
    };
    const update_ = async() => {
        console.log(carUpdate);
        const respone = await API.patch(
            `trungTamDangKiem/${user}/car/update`,
            { ...carUpdate},
        );
        console.log(respone);
        if(respone.status==="ok")
        {successUpdate();
        setOpenUpdate(false);
        setTimeout(() => {
            setDisplayDetail(false);
        }, 700);}
        else failUpdate()
    };
    const [carUpdate, setCarUpdate] = useState({
        organization: carInfor?.carOwner?.organization,
        ownerName: carInfor?.carOwner?.name,
        regionName: carInfor?.regionName,
        address: carInfor?.carOwner?.address||"Việt Nam",
        ID: carInfor?.carOwner?.ID,
        byPass: true,
        licensePlate: carInfor?.licensePlate,
        licensePlateNew: carInfor?.licensePlate,
        trungTamDangKiemName: '',
    });
    const handleOpenChangeUpdate = (newOpen) => {
        setOpenUpdate(newOpen);
    };
    const handleOpenChangeDelete = (newOpen) => {
        setOpenDelete(newOpen);
    };
    const [isEditable, setisEditable] = useState(false);

    const handleClose = () => {
        setDisplayDetail(false);
    };
    const handleChangeEdit = () => {
        setisEditable(!isEditable);
    };
    
    //legacy in register detail
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCarUpdate({...carUpdate,[name]:value})
    };
    const handleCheck = (event) =>{
        setCarUpdate({...carUpdate,organization:!carUpdate.organization })
    }
    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <div className={cx('container')}>
                <div className={cx('icon_close')} onClick={handleClose}>
                    <Close width={'2.4rem'} height={'2.4rem'} />
                </div>
                <div className={cx('title_info')}>{`Thông tin phương tiện ${carInfor?.licensePlate}`}</div>
                <div className={cx('content')}>
                    <div className={cx('info')}>
                        Biển số xe
                        <input
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            onInput={handleChange}
                            name="licensePlateNew"
                            value={`${carUpdate.licensePlateNew}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Chủ sở hữu
                        <input
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="ownerName"
                            onInput={handleChange}
                            value={`${carUpdate.ownerName}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Số CMND
                        <input
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="ID"
                            onInput={handleChange}
                            value={`${carUpdate.ID}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Tỉnh
                        <input
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="regionName"
                            onInput={handleChange}
                            value={`${carUpdate.regionName}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Hãng xe
                        <input className={cx('input')} disabled={true} value={`${carInfor?.type ? 'Mec' : 'Xe cỏ'}`} />
                    </div>
                    <div className={cx('info')}>
                        Dòng xe
                        <input className={cx('input')} disabled={true} value={`${carInfor?.carSpecification?.type}`} />
                    </div>
                    <div className={cx('info')}>
                        Phiên bản
                        <input className={cx('input')} disabled={true} value={`${carInfor?.version}`} />
                    </div>
                    <div className={cx('info')}>
                        Ngày đăng kí
                        <input
                            className={cx('input')}
                            disabled={true}
                            value={`${
                                carInfor?.registrationInformation?.dateOfIssue
                                    ? new Date(carInfor.registrationInformation.dateOfIssue).toISOString().slice(0, 10)
                                    : 'Chưa rõ'
                            }`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Ngày hết hạn
                        <input
                            className={cx('input')}
                            disabled={true}
                            value={`${
                                carInfor?.registrationInformation?.dateOfExpiry
                                    ? new Date(carInfor.registrationInformation.dateOfExpiry).toISOString().slice(0, 10)
                                    : 'Chưa rõ'
                            }`}
                        />
                    </div>
                    <div className={cx('info')}>
                        Xe công vụ
                        <input
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            value={carUpdate.organization == true ? 'Có' : 'Không'}
                            onClick={handleCheck}
                        />
                    </div>
                    <div className={cx('option')}>
                        {isEditable === true ? (
                            <Popover
                                content={<a onClick={update_}>Xác Nhận</a>}
                                open={openUpdate}
                                onOpenChange={handleOpenChangeUpdate}
                                title="Bạn có chắc là muốn cập nhật"
                                trigger="click"
                            >
                                <div className={cx('button')}>Cập nhật</div>
                            </Popover>
                        ) : (
                            <div className={cx('button', 'active')} onClick={handleChangeEdit}>
                                Thay đổi thông Tin
                            </div>
                        )}

                        <Popover
                            content={<a onClick={delete_}>Xác Nhận</a>}
                            open={openDelete}
                            onOpenChange={handleOpenChangeDelete}
                            title="Bạn có chắc là muốn xóa"
                            trigger="click"
                        >
                            <div className={cx('button')}>Xóa</div>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetail;
