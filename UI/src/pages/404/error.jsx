import { Outlet } from "react-router-dom";
import styles from "./error.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Error() {
    return (<div className={cx('wrapper')}>

    page nay chung to link loi
    <Outlet/>
    </div>
    );
}

export default Error;