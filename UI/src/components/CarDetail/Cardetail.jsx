import { Outlet, useParams } from 'react-router-dom';
import styles from './Cardetail.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import { SearchIcon, Close } from '~/components/Icons';
import { message, Popover } from 'antd';
import * as API from '~/services/searchService';
import { TextField, Typography, Button } from '@mui/material';

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
    const update_ = async () => {
        console.log(carUpdate);
        const respone = await API.patch(
            `trungTamDangKiem/${user}/car/update`,
            { ...carUpdate },
        );
        console.log(respone);
        if (respone.status === "ok") {
            successUpdate();
            setOpenUpdate(false);
            setTimeout(() => {
                setDisplayDetail(false);
            }, 700);
        }
        else failUpdate()
    };
    const [carUpdate, setCarUpdate] = useState({
        organization: carInfor?.carOwner?.organization,
        ownerName: carInfor?.carOwner?.name,
        regionName: carInfor?.regionName,
        address: carInfor?.carOwner?.address || "Việt Nam",
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
        setCarUpdate({ ...carUpdate, [name]: value })
    };
    const handleCheck = (event) => {
        setCarUpdate({ ...carUpdate, organization: !carUpdate.organization })
    }
    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <div className={cx('container')}>
                <div className={cx('icon_close')} onClick={handleClose}>
                    <Button onClick={handleClose}>Đóng</Button>
                </div>
                <Typography variant="h4" color="primary" mb={3}>{`Thông tin phương tiện ${carInfor?.licensePlate}`}</Typography>
                <div className={cx('content')}>
                    <div className={cx('info')}>
                        <Typography variant='body1'>Biển số xe</Typography>
                        <TextField variant='outlined'
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            onInput={handleChange}
                            name="licensePlateNew"
                            value={`${carUpdate.licensePlateNew}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Chủ sở hữu</Typography>
                        <TextField variant='outlined'
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="ownerName"
                            onInput={handleChange}
                            value={`${carUpdate.ownerName}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Số CMND</Typography>
                        <TextField variant='outlined'
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="ID"
                            onInput={handleChange}
                            value={`${carUpdate.ID}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Tỉnh</Typography>
                        <TextField variant='outlined'
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            name="regionName"
                            onInput={handleChange}
                            value={`${carUpdate.regionName}`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Hãng xe</Typography>
                        <TextField variant='outlined' className={cx('input')} InputProps={{
                            readOnly: true,
                        }} value={`${carInfor?.type ? 'Mec' : 'Xe cỏ'}`} />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Dòng xe</Typography>
                        <TextField variant='outlined' className={cx('input')} InputProps={{
                            readOnly: true,
                        }} value={`${carInfor?.carSpecification?.type}`} />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Phiên bản</Typography>
                        <TextField variant='outlined' className={cx('input')} InputProps={{
                            readOnly: true,
                        }} value={`${carInfor?.version}`} />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Ngày đăng kí</Typography>
                        <TextField variant='outlined'
                            className={cx('input')}
                            InputProps={{
                                readOnly: true,
                            }}
                            value={`${carInfor?.registrationInformation?.dateOfIssue
                                ? new Date(carInfor.registrationInformation.dateOfIssue).toISOString().slice(0, 10)
                                : 'Chưa rõ'
                                }`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Ngày hết hạn</Typography>
                        <TextField variant='outlined'
                            className={cx('input')}
                            InputProps={{
                                readOnly: true,
                            }}
                            value={`${carInfor?.registrationInformation?.dateOfExpiry
                                ? new Date(carInfor.registrationInformation.dateOfExpiry).toISOString().slice(0, 10)
                                : 'Chưa rõ'
                                }`}
                        />
                    </div>
                    <div className={cx('info')}>
                        <Typography>Xe công vụ</Typography>
                        <TextField variant='outlined'
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            value={carUpdate.organization == true ? 'Có' : 'Không'}
                            onClick={handleCheck}
                        />
                    </div>
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
                                <Button variant="contained">
                                    Cập nhật
                                </Button>
                            </Popover>
                        ) : (
                            <Button variant="contained" onClick={handleChangeEdit}>
                                Thay đổi thông tin
                            </Button>
                        )}

                        <Popover
                            content={<a onClick={delete_}>Xác Nhận</a>}
                            open={openDelete}
                            onOpenChange={handleOpenChangeDelete}
                            title="Bạn có chắc là muốn xóa"
                            trigger="click"
                        >
                            <Button>Xóa</Button>
                        </Popover>
                    </div>
            </div>
        </div>
    );
}

export default CarDetail;
