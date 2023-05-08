import { Outlet } from "react-router-dom";
import styles from "./BarStatistic.module.scss";
import classNames from 'classnames/bind';
import Button from "../Button";

const cx = classNames.bind(styles);
function BarStatistic({children}) {
    return (<div className={cx('wrapper')}>
            {children}
    <Outlet/>
    </div>
    );
}

export default BarStatistic;