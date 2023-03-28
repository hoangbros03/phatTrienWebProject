import { Outlet } from "react-router-dom";
import styles from "./statistic.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function StatisticCDK() {
    return (<div className={cx('wrapper')}>
        StatisticCDK
    <Outlet/>
    </div>
    );
}

export default StatisticCDK;