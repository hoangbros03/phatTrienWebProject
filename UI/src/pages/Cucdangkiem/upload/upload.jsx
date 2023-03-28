import { Outlet } from "react-router-dom";
import styles from "./upload.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Upload() {
    return (<div className={cx('wrapper')}>
        Upload
    
    <Outlet/>
    </div>
    );
}

export default Upload;