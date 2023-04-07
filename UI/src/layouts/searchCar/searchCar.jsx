import { Outlet } from 'react-router-dom';
import styles from './searchCar.module.scss';
import classNames from 'classnames/bind';
import { SearchIcon, Close } from '~/components/Icons';
import { useState } from 'react';

const cx = classNames.bind(styles);
function SearchCar() {
    const [licensePlate, setLicensePlate] = useState('');
    const [message, setMessage] = useState('');

    const [popup, setPopup] = useState(false);
    const handleInput = (e) => {
        setLicensePlate(e.target.value);
    };
    const GetAPI = () => {
        console.log(licensePlate);
        if (licensePlate.length != 10) setMessage('Vui lòng nhập đúng định dạng');
        // setPopup(true)
    };
    const handleClose = () => {
        setLicensePlate('');
        setPopup(false);
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
    const renderInforCar = () => {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('icon_close')} onClick={handleClose}>
                        <Close width={'2.4rem'} height={'2.4rem'} />
                    </div>
                    <div className={cx('title_info')}>{`Thông tin phương tiện ${licensePlate}`}</div>
                    <div className={cx('content')}>
                        <div className={cx('info')}>
                            Mã số asđăng kí<p>Mã sốg kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã sng kí<p>Mã số đăng kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã sốasd đăng kí<p>Mã ăng1</p>
                        </div>
                        <div className={cx('info')}>
                            Msadfng kí<p>Mã số đăng kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số đăng kí<p>Mã số đăng kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số fdsađăng kí<p>Mã ng kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số asdđăng kí<p>Mã sống kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số đănfasdfg kí<p>Mã skí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số đăasdng kí<p>Mã s kí1</p>
                        </div>
                        <div className={cx('info')}>
                            Mã số đăasdng kí<p>Mã s kí1</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {popup === true ? renderInforCar() : renderSearchBar()}

            <Outlet />
        </>
    );
}

export default SearchCar;
