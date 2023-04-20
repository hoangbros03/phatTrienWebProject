import { Outlet } from 'react-router-dom';
import styles from './searchCar.module.scss';
import classNames from 'classnames/bind';
import { SearchIcon, Close } from '~/components/Icons';
import { useState } from 'react';
import CarDetail from '../../components/CarDetail/Cardetail';

const cx = classNames.bind(styles);
function SearchCar() {
    //search
    const [licensePlate, setlicensePlate] = useState('');
    const [message, setMessage] = useState('');
    const [carInfor,setCarInfor] = useState(null)
    const [displayDetail, setDisplayDetail] = useState(false);


    const handleInput = (event) => {
        setlicensePlate(event.target.value);
    };
    const GetAPI=()=>{
        //get data from backend
        if(licensePlate==="123") setDisplayDetail(true)
        if(carInfor==null)
        {setMessage('Vui lòng nhập lại biển số xe')}
        else setDisplayDetail(true)
    }

    const renderSearchBar = () => {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('title')}>Tìm Kiếm Phương Tiện</div>
                <div className={cx('searchBtn')}>
                    <input
                        className={cx('content')}
                        placeholder="Nhập Biển Số Xe"
                        value={licensePlate}
                        onChange={handleInput}
                    ></input>
                    <div className={cx('icon')} onClick={GetAPI}>
                        <SearchIcon />
                    </div>
                </div>
                <div className={cx('message')}>{message}</div>
            </div>
        );
    };

    

    return (
        <>
            {displayDetail? <CarDetail carInfor={carInfor} setDisplayDetail={setDisplayDetail}/> : renderSearchBar()}
            <Outlet />
        </>
    );
}

export default SearchCar;
