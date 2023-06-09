import { Outlet } from 'react-router-dom';
import styles from './carlist.module.scss';
import classNames from 'classnames/bind';
import BarStatistic from '~/components/BarStatistic/BarStatistic';
import { useEffect, useState } from 'react';
import ButtonSearch from '~/components/ButtonSearch';
import Pagination from '../../../components/Pagination/Pagination';
import RegisterDetail from '~/components/RegisterDetail/RegisterDetail';
import * as API from '~/services/searchService';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { Autocomplete, Stack, TextField, Button, Paper, Typography } from '@mui/material';

const cx = classNames.bind(styles);
function CarList() {
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
    const years = ['All'];
    const currentYear = new Date().getFullYear();
    const quarter = ['All', '1', '2', '3', '4'];
    const [month, setMonth] = useState(['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    const type = ['Đã đăng kiểm', 'Sắp đến hạn', 'Dự đoán'];
    const carType = ['All', 'Xe tải', 'Xe con', 'Xe khách', 'Xe bán tải', 'Xe dịch vụ'];
    const province = [
        'All',
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
        'Cà Mau',
    ];
    const [ttdk, setTtdk] = useState(['All']);
    for (let year = currentYear; year >= currentYear - 50; year--) {
        if (years.length < 50) years.push(year.toString());
    }

    //pagination
    const [carData, setCarData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = carData.slice(firstPostIndex, lastPostIndex);

    const HandlerChange = async (data, type_) => {
        if (type_ == 'province') {
            console.log('KK');
            const response = await API.getCenter(
                'trungTamDangKiem/:user/getCenters',
                { user: user },
                { regionName: data.target.innerText },
            );
            console.log(response);
            const result = response.map((res) => res.name);
            setTtdk(['All', ...result]);
        }
        setObject({ ...object, [type_]: data.target.innerText });
        console.log(type_, data.target.innerText);
        //check conditon for type quarter
        if (type_ == 'quarter') {
            if (data.target.innerText == 'All')
                setMonth(['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
            if (data.target.innerText == '1') {
                setMonth(['All', '1', '2', '3']);
            }
            if (data.target.innerText == '2') {
                setMonth(['All', '4', '5', '6']);
            }
            if (data.target.innerText == '3') {
                setMonth(['All', '7', '8', '9']);
            }
            if (data.target.innerText == '4') {
                setMonth(['All', '10', '11', '12']);
            }
        }
        //console.log(object);
    };

    const [messageApi, contextHolder] = message.useMessage();
    const infoChange = () => {
        messageApi.info('Xe này đã bị thay đổi biển số');
    };
    const infoNocar = () => {
        messageApi.info('Không có lịch sử đăng kiểm');
    };

    //send request to backend
    const HandleSearch = async () => {
        const response = await API.post('/trungTamDangKiem/ratdd/carList', {
            ...object,
        });
        if (response.message === 'No car found.') {
            infoNocar();
            setCarData([]);
        } else {
            setCarData([...response]);
        }
    };


//This function reduce the size of carData by group all lượt đăng kiểm of a car into one object
   
    for(let i = 0; i < carData.length - 1; i++) {
        while(carData[i]?.licensePlate == carData[i+1]?.licensePlate) {
            carData.splice(i+1, 1);
        }
    } 

    const [carInfor, setCarInfor] = useState(null);
    const [displayDetail, setDisplayDetail] = useState(false);
    const [history, setHistory] = useState({});

    const handleDisplayDetail = async (licensePlate, _idregister, index) => {
        let result = await API.searchCar(
            'trungTamDangKiem/:user/searchCar',
            { user: user },
            { searchValue: licensePlate },
        );
        if (result.status == 'No car match') {
            infoChange();
            return;
        } else {
            console.log(result.status.historyRegistrationInformation);
            setCarInfor(result.status);
            setDisplayDetail(true);
            setHistory({
                dois: carData[index].dois,
                does: carData[index].does
            })
        }
        //gui requset lay detail
        // const response = await ApicAll.post
    };
    //handle export
    const handleExport = async (e) => {
        console.log(user);
        let result = await API.handleFileDownload(`trungTamDangKiem/${user}/databaseManagement/export`, { ...object });
    };

    return (
        <>
            {contextHolder}

            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    {/* <div>
                            <Autocomplete options={carType} onChangeCapture={HandlerChange}/>
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
                            <ButtonSearch  bar data={month} type_="month" onClick={HandlerChange}>
                                Tháng
                            </ButtonSearch>
                        </BarStatistic>
                        <BarStatistic>
                            <ButtonSearch bar input data={province} type_="province" onClick={HandlerChange}>
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
                            <span style={{ borderRight: '1px solid white' }}></span>
                            <Button bar onClick={handleExport}>
                                Xuất File
                            </Button>
                        </BarStatistic>
                    </div> */}

                    <div>
                        <Stack direction='row' spacing={2}>
                            <Autocomplete
                                disablePortal
                                type_="type"
                                options={carType}
                                onChange={HandlerChange}
                                sx={{ width: 150 }}
                                renderInput={(params) => <TextField {...params} label="Loại xe" />}
                            />

                            <Autocomplete
                                disablePortal
                                type_="year"
                                options={years}
                                onChange={HandlerChange}
                                sx={{ width: 130 }}
                                renderInput={(params) => <TextField {...params} label="Năm" />} 
                            />

                            <Autocomplete
                                disablePortal
                                type_="month"
                                options={month}
                                onChange={HandlerChange}
                                sx={{ width: 130 }}
                                renderInput={(params) => <TextField {...params} label="Tháng" />}
                            />

                            <Autocomplete
                                disablePortal
                                type_="province"
                                options={province}
                                onChange={HandlerChange}
                                sx={{ width: 150 }}
                                renderInput={(params) => <TextField {...params} label="Tỉnh" />}
                            />

                            <Autocomplete
                                disablePortal
                                type_="ttdk"
                                options={ttdk}
                                onChange={HandlerChange}
                                sx={{ width: 150 }}
                                renderInput={(params) => <TextField {...params} label="Trung tâm" />}
                            />

                            <Button variant="contained" onClick={HandleSearch}>
                                Tìm kiếm
                            </Button>

                            <Button variant="outlined" onClick={handleExport}>
                                Xuất file
                            </Button>
                        </Stack>
                    </div>

                    <div className={cx('content')}>
                        <aside className={cx('aside')}>
                            <div className={cx('header')}>
                                <Typography variant='subtitle1'>
                                    Biển số
                                </Typography>

                                <Typography variant='subtitle1'>
                                    Chủ sở hữu
                                </Typography>
                            </div>
                            {currentPosts.map((car, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={cx('cardisplay')}
                                        onClick={() => handleDisplayDetail(car.licensePlate, car._id, index)}
                                    >
                                        <Typography align="left" color="secondary">
                                        {car.licensePlate}
                                        </Typography>

                                        <Typography align="left">
                                        {car.ownerName}
                                        </Typography>
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
                            {displayDetail ? (
                                <RegisterDetail
                                    carInfor={carInfor}
                                    setDisplayDetail={setDisplayDetail}
                                    setCarInfor={setCarInfor}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    );
}

export default CarList;
