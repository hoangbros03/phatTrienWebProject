import { Outlet } from "react-router-dom";
import styles from "./indexCDK.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function IndexCDK() {
    return (<div className={cx('wrapper')}>
        <p>Chào mừng Bạn đã đăng nhập thành công</p>
    
    <Outlet/>
    </div>
    );
}

export default IndexCDK;