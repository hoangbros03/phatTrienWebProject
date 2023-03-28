import { Outlet } from "react-router-dom";
import styles from "./contact.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Contact() {
    return (<div className={cx('wrapper')}>

    
    <Outlet/>
    </div>
    );
}

export default Contact;