import { Outlet } from "react-router-dom";
import styles from "./about.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function About() {
    return (<div className={cx('wrapper')}>

    
    <Outlet/>
    </div>
    );
}

export default About;