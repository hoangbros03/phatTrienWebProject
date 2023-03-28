import { Outlet } from "react-router-dom";
import styles from "./lookup.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Lookup() {
    return (<div className={cx('wrapper')}>

 Lookup
    <Outlet/>
    </div>
    );
}

export default Lookup;