import { Outlet } from "react-router-dom";
import styles from "./statistic.module.scss";
import classNames from 'classnames/bind';
import BarStatistic from '~/components/BarStatistic/BarStatistic';
import Pagination from '../../../components/Pagination/Pagination';

import CarDetail from '../../../components/CarDetail/Cardetail';
import { useEffect, useState } from 'react';
import Button from '~/components/Button';
import ButtonSearch from '~/components/ButtonSearch';
const cx = classNames.bind(styles);
function StatisticTTDK() {


const [object, setObject] = useState({
        type: 'All',
        typecar: 'All',
        year: 'All',
        quater: 'All',
        month: 'All',
    });
    const [activeButton, setActiveButton] = useState(0);

    const years = ['All'];
    const currentYear = new Date().getFullYear();
    const quater = ['All', 1, 2, 3, 4];
    const [month,setMonth] = useState(['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const type = ['Đã đăng kiểm', 'Sắp đến hạn', 'Dự đoán'];
    const typecar = ['All', 'Xe tải', 'Xe con'];
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
    const HandleSearch = async() => {
        console.log(object)
        await fetch('http://localhost:3500/trungTamDangKiem/ratdd/carList', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              object
            })
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        
        
    };

    //test pagination
    const [ListCar,setListCar]= useState([])
    const [carInfor,setCarInfor]=useState(null);
    const [displayDetail, setDisplayDetail] = useState(false);
    const handleDisplayDetail = async() => {
        setDisplayDetail(true);
        //gui requset lay detail
        setCarInfor(ListCar[0])
    };
    
    //pagination
    const [carData, setcarData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    useEffect(() => {
        setcarData(ListCar);
    }, []);
    const currentPosts = carData.slice(firstPostIndex, lastPostIndex);

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
                        <Button bar onClick={HandleSearch}>
                            Tìm kiếm
                        </Button>
                    </BarStatistic>
                </div>
                <div className={cx('content')}>
                    <aside className={cx('aside')}>
                        <div className={cx('header')}>
                            <p>Biển số</p>
                            <p>Chủ sở Hữu</p>
                        </div>
                        {currentPosts.map((car, index) => {
                            return (
                                <div key={index} className={cx('cardisplay')} onClick={handleDisplayDetail}>
                                    <p>{car.licensePlate}</p>
                                    <p>{car.owner}</p>
                                </div>
                            );
                        })}
                        {ListCar.length>10?<Pagination
                            totalPosts={carData.length}
                            postsPerPage={postsPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />:null}
                    </aside>
                    <div className={cx('detail')}>
                        {displayDetail ? <CarDetail carInfor={carInfor}  setDisplayDetail={setDisplayDetail}/> : null}
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
    
}

export default StatisticTTDK;