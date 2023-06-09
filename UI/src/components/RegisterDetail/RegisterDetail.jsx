import { Outlet } from "react-router-dom";
import * as React from 'react';
import styles from "./RegisterDetail.module.scss";
import classNames from 'classnames/bind';
import { useState } from "react";
import { Close } from '~/components/Icons';
import { Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const cx = classNames.bind(styles);
function RegisterDetail({ carInfor, setDisplayDetail, setCarInfor }) {
    console.log(carInfor)
    const history = carInfor?.historyRegistrationInformation;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };


    // display detail

    const [carSend, setCarSend] = useState(null);
    const [isEditable, setisEditable] = useState(false);

    const handleClose = () => {
        setDisplayDetail(false);
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
                <Typography variant="h5">
                    {`Thông tin đăng kiểm xe ${carInfor?.licensePlate}`}
                </Typography>
                <div className={cx('content')}>
                    <div className={cx('info')}>
                        <Typography variant="subtitle1">
                            Biển kiểm sát
                        </Typography>
                        <Typography
                            disabled={!isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            onInput={handleChange}
                            name="licensePlate"
                            value={`${carInfor?.licensePlate}`}
                            variant="body1"
                        >
                            {`${carInfor?.licensePlate}`}
                        </Typography>
                    </div>

                    <div className={cx('info')}>
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
                            Hãng xe
                        </Typography>

                        <Typography className={cx('input')} disabled={true} value={`${carInfor?.producer}`} >
                            {`${carInfor?.producer}`}
                        </Typography>
                    </div>
                    <div className={cx('info')}>
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
                            Phiên bản
                        </Typography>

                        <Typography className={cx('input')} disabled={true} value={`${carInfor?.version}`} >
                            {`${carInfor?.version}`}
                        </Typography>
                    </div>
                    <div className={cx('info')}>
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
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
                        <Typography variant="subtitle1">
                            Xe công vụ
                        </Typography>

                        <Typography
                            disabled={isEditable}
                            className={cx(`${isEditable === true ? 'edit' : ''}`, 'input')}
                            value={carInfor?.carOwner?.organization == true ? "Có" : "Không"}

                        >{carInfor?.carOwner?.organization == true ? "Có" : "Không"}</Typography>
                    </div>
                    <div className={cx('info')}>
                        <Button variant="outlined" onClick={handleClickOpen}
                            sx={{
                                width: '200px'
                            }}
                        >
                            Xem lịch sử đăng kiểm
                        </Button>
                    </div>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                        maxWidth="xl"
                    >
                        <DialogTitle>Lịch sử đăng kiểm</DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="80px" align="left">Ngày đăng kiểm</TableCell>
                                            <TableCell width="50px" align="left">Ngày hết hạn</TableCell>
                                            <TableCell width="150px" align="left">Trung tâm đăng kiểm</TableCell>
                                            <TableCell align="left">Tỉnh</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            history.map((registration) => (
                                                <TableRow
                                                    key={registration.dateOfIssue}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell width="50px" component="th" scope="row">
                                                        {registration.dateOfIssue.slice(0, 10)}
                                                    </TableCell>

                                                    <TableCell width="50px" align="left">
                                                        {registration.dateOfExpiry.slice(0, 10)}
                                                    </TableCell>

                                                    <TableCell width="150px" align="left">
                                                        {registration.trungTamDangKiemName}
                                                    </TableCell>

                                                    <TableCell width="30px" align="left">
                                                        {registration.regionName}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Đóng</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default RegisterDetail;