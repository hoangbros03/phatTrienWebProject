import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Layout() {
    return (<div className={cx('wrapper')}>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <Outlet/>
    </div>
    );
}

export default Layout;