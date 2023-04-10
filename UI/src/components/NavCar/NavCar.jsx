import { Outlet } from "react-router-dom";
import styles from "./NavCar.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function NavCar() {

    return (<div className={cx('wrapper')}  >
        <div>Chủ sở hữu</div>
        <div>Ngày đăng kiểm</div>
        <div>Biển số xe</div>
        <div>Tỉnh</div>
        <div>Trung tâm đăng kiểm</div>
    </div>
    );
}

export default NavCar;