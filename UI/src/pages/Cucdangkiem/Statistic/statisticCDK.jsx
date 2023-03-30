import { Outlet } from "react-router-dom";
import styles from "./statistic.module.scss";
import classNames from 'classnames/bind';
import BarStatistic from "../../../components/BarStatistic/BarStatistic";
import CarItem from "../../../components/CarItems/CarItem";
import StatisticImage from "../../../components/StatisticImage/statisticimage";
const cx = classNames.bind(styles);
function StatisticCDK() {
    return (<div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('navbar')}>
            <BarStatistic title1="Đã đăng kiểm" title2="Sắp đến hạn" title3="Dự đoán"></BarStatistic>
            <BarStatistic title1="Năm" title2="Quý" title3="Tháng"></BarStatistic>
            <BarStatistic title1="Quốc Gia" title2="Tỉnh" title3="TTĐK"></BarStatistic>
        </div>
        <div className={cx('content')}>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>
            <CarItem></CarItem>


        </div>
        <div className={cx('footer')}>
            <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
            <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
            <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
            <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
        </div>
        </div>
    <Outlet/>
    </div>
    );
}

export default StatisticCDK;