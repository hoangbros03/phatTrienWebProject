import { Outlet } from "react-router-dom";
import styles from "./StatisticImage.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function StatisticImage({province,growth,addcar}) {
    return (<div className={cx('wrapper')}>
        <div className={cx('image')}>
            <p>{province}</p>
        </div>
        <div className={cx("content")}>
            <p className={cx("title")}>Xe đăng kiểm trong 2023</p>
            <div className={cx("growth")}><p>{growth}</p></div>
            <p className={cx("footer")}>+ {addcar} so với 2022</p>
        </div>
    
    <Outlet/>
    </div>
    );
}

export default StatisticImage;