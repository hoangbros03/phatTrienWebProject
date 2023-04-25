import { Outlet } from "react-router-dom";
import styles from "./contact.module.scss";
import contactGif from "../../assets/images/Contact.gif";
import phone from "../../assets/images/phone.png";
import email from "../../assets/images/email.png";
import location from "../../assets/images/location.png";
import time from "../../assets/images/time.png";
import IconPanel from './IconPanel.jsx';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.animated}>
                <img src={contactGif} alt="gif"></img>
            </div>

            <div className={styles.content}>
                <h1>Liên hệ với chúng tôi</h1>
                <br />
                <p>Giải đáp mọi thông tin qua các địa chỉ sau: </p><br /><br />
                <IconPanel src={phone} >0392 038 984</IconPanel><br />
                <IconPanel src={email}>cucdangkiem.gov.vn</IconPanel><br />
                <IconPanel src={location}>18 Phạm Hùng, Phường Mỹ Đình 2, Quận Nam Từ Liêm</IconPanel><br />
                <IconPanel src={time}>7:00 sáng đến 16:00 chiều</IconPanel>
            </div>
        </div>
    );
}

export default Contact;