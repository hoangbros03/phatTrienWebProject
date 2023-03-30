import { Outlet } from "react-router-dom";
import styles from "./BarStatistic.module.scss";
import classNames from 'classnames/bind';
import Button from "../Button";
import { useState } from 'react';
const cx = classNames.bind(styles);
function BarStatistic({title1,title2,title3}) {
    const [activeButton, setActiveButton] = useState(0);
    function handleClick(index) {
        setActiveButton(index);
      }
    return (<div className={cx('wrapper')}>
            <Button bar active={activeButton === 0} onClick={() => handleClick(0)} >{title1}</Button>
            <Button bar active={activeButton === 1} onClick={() => handleClick(1)}>{title2}</Button>
            <Button bar active={activeButton === 2} onClick={() => handleClick(2)}>{title3}</Button>
    <Outlet/>
    </div>
    );
}

export default BarStatistic;