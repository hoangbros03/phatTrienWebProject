import { Outlet } from 'react-router-dom';
import styles from './searchCar.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import CarDetail from '../../components/CarDetail/Cardetail';
import * as API from '~/services/searchService';
import { useParams } from "react-router-dom";
import { TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import url from '../../assets/images/truck.gif'

const cx = classNames.bind(styles);
function SearchCar() {
    //search
    const { user } = useParams();

    const [licensePlate, setlicensePlate] = useState('');
    const [message, setMessage] = useState('');
    const [carInfor, setCarInfor] = useState(null);
    const [displayDetail, setDisplayDetail] = useState(false);
    const handleInput = (event) => {
        setlicensePlate(event.target.value);
    };
    const GetAPI = async () => {
        //get data from backend
        if (licensePlate.length <= 3)
            setMessage("Vui Lòng Điền Thêm Thông Tin")
        else {
            const result = await API.searchCar('trungTamDangKiem/:user/searchCar', { user: user }, { searchValue: licensePlate })
            console.log(result)
            if (result?.status == "No car match") {
                setMessage("Biển số xe chưa đúng vui lòng nhập lại")
            }
            else {
                setCarInfor(result.status)
                setMessage("")
                setlicensePlate("")
                setDisplayDetail(true)
            }
        }



    };

    const renderSearchBar = () => {
        return (
            <div className={cx('wrapper')}>
                <Typography variant="h4" color="primary">
                    Tìm kiếm phương tiện
                </Typography>
                <div className={cx('searchBtn')}>
                    <TextField label="Nhập biển số xe" value={licensePlate} onChange={handleInput}
                        sx={{
                            width: "90%"
                        }}
                    />

                    <div className={cx('icon')} onClick={GetAPI}>
                        <SearchIcon fontSize='large' color="primary" />
                    </div>
                </div>

                <Typography variant='h6' color='error' sx={{ marginTop: 5 }}>
                    {message}
                </Typography>

                <img src={url} alt="gif" style={{
                    width: 550,
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }} />
            </div>
        );
    };

    return (
        <>
            {displayDetail ? <CarDetail carInfor={carInfor} setDisplayDetail={setDisplayDetail} setCarInfor={setCarInfor} /> : renderSearchBar()}
            <Outlet />
        </>
    );
}

export default SearchCar;
