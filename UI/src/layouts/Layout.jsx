import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Layout() {
    return (<div className={cx('wrapper')}>
    <Outlet/>
    </div>
    );
}

export default Layout;