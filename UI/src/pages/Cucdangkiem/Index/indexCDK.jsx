import { Outlet } from "react-router-dom";
import styles from "./indexCDK.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function IndexCDK() {
    return (<div className={cx('wrapper')}>

    
    <Outlet/>
    </div>
    );
}

export default IndexCDK;