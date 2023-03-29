import { Outlet } from "react-router-dom";
import styles from "./statistic.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function StatisticTTDK() {
    return (<div className={cx('wrapper')}>

 StatisticTTDK
    <Outlet/>
    </div>
    );
}

export default StatisticTTDK;