import { Outlet } from 'react-router-dom';
import styles from './statistic.module.scss';
import classNames from 'classnames/bind';


import BarStatistic from '~/components/BarStatistic/BarStatistic';
import CarItem from '~/components/CarItems/CarItem';
import StatisticImage from '~/components/StatisticImage/statisticimage';
import NavCar from '~/components/NavCar/NavCar';
import { useEffect, useState } from 'react';
import Button from '~/components/Button';
import ButtonSearch from '~/components/ButtonSearch';
const cx = classNames.bind(styles);
function StatisticCDK() {
    const [object, setObject] = useState({
        type: 'All',
        typecar: 'All',
        year: 'All',
        quater: 'All',
        month: 'All',
        province: 'All',
        ttdk: 'All',
    });
    const [activeButton, setActiveButton] = useState(0);

    const years = ['All'];
    const currentYear = new Date().getFullYear();
    const quater = ['All', 1, 2, 3, 4];
    const [month,setMonth] = useState(['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const type = ['Đã đăng kiểm', 'Sắp đến hạn', 'Dự đoán'];
    const typecar = ['All', 'Xe tải', 'Xe con'];
    const province = ['All', 'Hà Nội', 'Bắc Ninh', 'Bắc Giang', 'Thái Nguyên'];
    const ttdk = ['All', 'TTDK1', 'TTDK2', 'TTDK3', 'TTDK4'];
    for (let year = currentYear; year >= currentYear - 50; year--) {
        if (years.length < 50) years.push(year);
    }
    // const handleClick=(event, index)=> {
    //     setActiveButton(index);
    //     setObject({ ...object, type: event.target.innerText });
    // }
    const HandlerChange = (data, type_) => {
        setObject({ ...object, [type_]: data.target.innerText });



        //check conditon for type quater 
        if (type_ == "quater") {
            if (data.target.innerText == 'All') setMonth(['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            if (data.target.innerText == "1") {
                setMonth(['All', 1, 2, 3]);

            }
            if (data.target.innerText == "2") {
                setMonth(['All', 4, 5, 6]);
            }
            if (data.target.innerText =="3") {
                setMonth(['All', 7, 8, 9]);
            }
            if (data.target.innerText == "4") {
                setMonth(['All', 10, 11, 12]);
            }
        }
        //console.log(object);
    };
    const HandleSearch = () => {

        console.log(object);
    };
    const test={owner:"Test",
    licensePlate:"Test",
    dateOfIssue:"Test",
    regionName:"Test",
    tddk:"Test",}
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('navbar')}>
                    <BarStatistic>
                        <ButtonSearch bar data={typecar} type_="typecar" onClick={HandlerChange}>
                            Kiểu Xe
                        </ButtonSearch>
                    </BarStatistic>
                    <BarStatistic>
                        <ButtonSearch bar data={type} type_="type" onClick={HandlerChange}>
                            Tùy Chọn
                        </ButtonSearch>
                    </BarStatistic>
                    <BarStatistic>
                        <ButtonSearch bar data={years} type_="year" onClick={HandlerChange}>
                            Năm
                        </ButtonSearch>
                        <ButtonSearch bar data={quater} type_="quater" onClick={HandlerChange}>
                            Quý
                        </ButtonSearch>
                        <ButtonSearch bar data={month} type_="month" onClick={HandlerChange}>
                            Tháng
                        </ButtonSearch>
                    </BarStatistic>
                    <BarStatistic>
                        <ButtonSearch bar data={province} type_="province" onClick={HandlerChange}>
                            Tỉnh
                        </ButtonSearch>
                        <ButtonSearch bar data={ttdk} type_="ttdk" onClick={HandlerChange}>
                            TTDK
                        </ButtonSearch>
                    </BarStatistic>
                    <BarStatistic>
                        <Button bar onClick={HandleSearch}>
                            Tìm kiếm
                        </Button>
                    </BarStatistic>
                </div>
                <div className={cx('content')}>
                    {/* bị lỗi chỗ này cmt đi thì k bị nữa  */}
                    <NavCar></NavCar>
                    <CarItem car={test}></CarItem>
                    <CarItem car={test}></CarItem>
                    
                    
                    <CarItem car={test}></CarItem>
                    
                    <CarItem car={test}></CarItem>
                    
                    <CarItem car={test}></CarItem>
                    
                    <CarItem car={test}></CarItem>
                    
                    
                </div>
                <div className={cx('footer')}>
                    <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
                    <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
                    <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
                    <StatisticImage province="HN" growth={15} addcar={240}></StatisticImage>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default StatisticCDK;
