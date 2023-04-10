
import { useState } from "react";
import styles from "./CarItem.module.scss";
import classNames from 'classnames/bind';
import { SearchIcon, Close } from '~/components/Icons';
const cx = classNames.bind(styles);
function CarItem({car}) {
    const [popup, setPopup] = useState(false);
    const handleClose = () => {
        setPopup(false);
    }

    const renderInforCar = () => {
        return (
            <div className={cx('wrapperDetail')}>
                <div className={cx('container')}>
                    <div className={cx('icon_close')} onClick={handleClose}>
                        <Close width={'2.4rem'} height={'2.4rem'} />
                    </div>
                    <div className={cx('title_info')}>{`Thông tin phương tiện ${car?.licensePlate}`}</div>
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
    const renderInfor=()=>{return (
    <div className={cx('wrapperItem')} onClick={e=>{setPopup(true)}} >
        <div>{car?.owner}</div>
        <div>{car?.licensePlate}</div> 
        <div>{car?.dateOfIssue}</div>
        <div>{car?.regionName}</div>
        <div>{car?.tddk}</div>
    </div>
    );}
    return (
        
        <>
        {popup ? renderInforCar() : renderInfor()}
        </>)
    
}

export default CarItem;