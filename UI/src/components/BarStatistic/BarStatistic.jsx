import { Outlet } from "react-router-dom";
import styles from "./BarStatistic.module.scss";
import classNames from 'classnames/bind';
import Button from "../Button";
import { useState } from 'react';
const cx = classNames.bind(styles);
function BarStatistic({children}) {
    const [activeButton, setActiveButton] = useState(0);
    
    function handleClick(index) {
        setActiveButton(index);
      }
    return (<div className={cx('wrapper')}>
            {children}
    <Outlet/>
    </div>
    );
}

export default BarStatistic;