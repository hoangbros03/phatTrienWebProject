import { Outlet } from "react-router-dom";
import styles from "./indexttdk.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Indexttdk() {   
    return (<div className={cx('wrapper')}>
        <p>Chào mừng Bạn đã đăng nhập thành công</p>
        
    <Outlet/>
    </div>
    );
}

export default Indexttdk;