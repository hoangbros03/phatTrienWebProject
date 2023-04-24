import { Outlet } from 'react-router-dom';
import styles from './statistic.module.scss';
import classNames from 'classnames/bind';
import BarStatistic from '~/components/BarStatistic/BarStatistic';
import { useEffect, useState } from 'react';
import Button from '~/components/Button';
import ButtonSearch from '~/components/ButtonSearch';
import Pagination from '../../../components/Pagination/Pagination';
import CarDetail from '../../../components/CarDetail/Cardetail';
import * as API from '~/services/searchService';
import { useParams } from "react-router-dom";
const cx = classNames.bind(styles);
function StatisticCDK() {
    //object sent to backend
    const [object, setObject] = useState({
        type: 'Đã đăng kiểm',
        carType: 'All',
        year: 'All',
        quarter: 'All',
        month: 'All',
        province: 'All',
        ttdk: 'All',
    });
    let { user } = useParams();
    //for search
    const years = ['all'];
    const currentYear = new Date().getFullYear();
    const quarter = ['All', 1, 2, 3, 4];
    const [month, setMonth] = useState(['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const type = ['Đã đăng kiểm', 'Sắp đến hạn', 'Dự đoán'];
    const carType = ['All', 'Xe tải', 'Xe con'];
    const province = [
        'all',
        'Hà Nội',
        'Hà Giang',
        'Cao Bằng',
        'Bắc Kạn',
        'Tuyên Quang',
        'Lào Cai',
        'Điện Biên',
        'Lai Châu',
        'Sơn La',
        'Yên Bái',
        'Hòa Bình',
        'Thái Nguyên',
        'Lạng Sơn',
        'Bắc Giang',
        'Phú Thọ',
        'Vĩnh Phúc',
        'Bắc Ninh',
        'Hải Dương',
        'Hải Phòng',
        'Quảng Ninh',
        'Hưng Yên',
        'Thái Bình',
        'Hà Nam',
        'Nam Định',
        'Ninh Bình',
        'Thanh Hóa',
        'Nghệ An',
        'Hà Tĩnh',
        'Quảng Bình',
        'Quảng Trị',
        'Thừa Thiên Huế',
        'Đà Nẵng',
        'Quảng Nam',
        'Quảng Ngãi',
        'Bình Định',
        'Phú Yên',
        'Khánh Hòa',
        'Ninh Thuận',
        'Bình Thuận',
        'Kon Tum',
        'Gia Lai',
        'Đắk Lắk',
        'Đắk Nông',
        'Lâm Đồng',
        'Bình Phước',
        'Tây Ninh',
        'Bình Dương',
        'Đồng Nai',
        'Bà Rịa - Vũng Tàu',
        'Hồ Chí Minh',
        'Long An',
        'Tiền Giang',
        'Bến Tre',
        'Trà Vinh',
        'Vĩnh Long',
        'Đồng Tháp',
        'An Giang',
        'Kiên Giang',
        'Cần Thơ',
        'Hậu Giang',
        'Sóc Trăng',
        'Bạc Liêu',
        'Cà Mau'
      ];
    const ttdk = ['All', 'TTDK1', 'TTDK2', 'TTDK3', 'TTDK4'];
    for (let year = currentYear; year >= currentYear - 50; year--) {
        if (years.length < 50) years.push(year);
    }
   
    //pagination
    const [carData, setCarData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = carData.slice(firstPostIndex, lastPostIndex);

    const HandlerChange = (data, type_) => {
        setObject({ ...object, [type_]: data.target.innerText });

        //check conditon for type quarter
        if (type_ == 'quarter') {
            if (data.target.innerText == 'All') setMonth(['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            if (data.target.innerText == '1') {
                setMonth(['all', 1, 2, 3]);
            }
            if (data.target.innerText == '2') {
                setMonth(['all', 4, 5, 6]);
            }
            if (data.target.innerText == '3') {
                setMonth(['all', 7, 8, 9]);
            }
            if (data.target.innerText == '4') {
                setMonth(['all', 10, 11, 12]);
            }
        }
        //console.log(object);
    };
    //send request to backend
    const HandleSearch = async () => {
        console.log(carData);
        const response = await API.post('/trungTamDangKiem/ratdd/carList', { 
            ...object });
        if (response.message === 'No car found.') {console.log(response)
            setCarData([]);}
        else {console.log(response);
        setCarData([...response]);}
    };
    const [carInfor, setCarInfor] = useState(null);
    const [displayDetail, setDisplayDetail] = useState(false);
    const handleDisplayDetail = async (licensePlate) => {
        const result = await API.searchCar('trungTamDangKiem/:user/searchCar',{user:user}, {searchValue:licensePlate})
        console.log(result)
        setCarInfor(result.status)
        setDisplayDetail(true);
        //gui requset lay detail
        // const response = await ApicAll.post
    };
    
    

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('navbar')}>
                    <BarStatistic>
                        <ButtonSearch bar data={carType} type_="carType" onClick={HandlerChange}>
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

                        <ButtonSearch bar data={quarter} type_="quarter" onClick={HandlerChange}>
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
                    <aside className={cx('aside')}>
                        <div className={cx('header')}>
                            <p>Biển số</p>
                            <p>Chủ sở Hữu</p>
                        </div>
                        {currentPosts.map((car, index) => {
                            return (
                                <div key={index} className={cx('cardisplay')} onClick={() => handleDisplayDetail(car.licensePlate)}>
                                    <p>{car.licensePlate}</p>
                                    <p>{car.ownerName}</p>
                                </div>
                            );
                        })}
                        <Pagination
                            totalPosts={carData.length}
                            postsPerPage={postsPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />
                    </aside>
                    <div className={cx('detail')}>
                        {displayDetail ? <CarDetail carInfor={carInfor} setDisplayDetail={setDisplayDetail} setCarInfor={setCarInfor}/> : null}
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default StatisticCDK;
