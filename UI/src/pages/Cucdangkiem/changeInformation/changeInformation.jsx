import { Outlet } from "react-router-dom";
import styles from "./changeInformation.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function ChangeInformation() {
    return (<div className={cx('wrapper')}>

    
    <Outlet/>
    </div>
    );
}

export default ChangeInformation;