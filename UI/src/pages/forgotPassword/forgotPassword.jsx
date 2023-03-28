import { Outlet } from "react-router-dom";
import styles from "./forgotPassword.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function ForgotPassword() {
    return (<div className={cx('wrapper')}>

ForgotPassword
    <Outlet/>
    </div>
    );
}

export default ForgotPassword;