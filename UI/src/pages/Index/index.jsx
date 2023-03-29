import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Index() {
    return (<div className={cx('wrapper')}>

        trang chur
    <Outlet/>
    </div>
    );
}

export default Index;