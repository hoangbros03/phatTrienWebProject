import { Outlet } from 'react-router-dom';
import styles from './searchCar.module.scss';
import classNames from 'classnames/bind';
import { SearchIcon, Close } from '~/components/Icons';
import { useState } from 'react';
import CarDetail from '../../components/CarDetail/Cardetail';
import * as API from '~/services/searchService';
import { useParams } from "react-router-dom";

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
    const GetAPI = async() => {
        //get data from backend
        if(licensePlate.length<=3)
        setMessage("Vui Lòng Điền Thêm Thông Tin")
        else {
            const result = await API.searchCar('trungTamDangKiem/:user/searchCar',{user:user}, {searchValue:licensePlate})
            console.log(result)    
            if(result?.status =="No car match")
                {
                    setMessage("Biển số xe chưa đúng vui lòng nhập lại")
                }
                else{
                    setCarInfor(result.status)
                    setlicensePlate("")
                    setDisplayDetail(true)
                }
            }
           
    
        
    };
 
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
            {displayDetail ? <CarDetail carInfor={carInfor} setDisplayDetail={setDisplayDetail} setCarInfor={setCarInfor}/> : renderSearchBar()}
            <Outlet />
        </>
    );
}

export default SearchCar;
