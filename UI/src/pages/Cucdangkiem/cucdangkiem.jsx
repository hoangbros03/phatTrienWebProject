import { MenuItem } from '~/layouts/SliderBar/Menu';
import { HomeIcon, SearchIcon } from '~/components/Icons';

////
import { Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './cucdangkiem.module.scss';
import classNames from 'classnames/bind';
import { SignUpCenter, StatisticIcon } from '../../components/Icons';
const cx = classNames.bind(styles);
function Cucdangkiem() {
    const navigate = useNavigate();
    const { user } = useParams();
    const backtohomepage = () => {
        navigate();
        console.log("KKK")
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sliderbar')} >
                <MenuItem icon={<HomeIcon />} to={`../${user}`} title="Trở Về Trang Chủ"></MenuItem>
                <MenuItem icon={<SignUpCenter />} to="registerCenter" title="Đăng kí Trung Tâm Đăng Kiểm"></MenuItem>
                <MenuItem icon={<SignUpCenter />} to="changeInformation" title="Thay đổi Thông Tin"></MenuItem>
                <MenuItem icon={<StatisticIcon />} to="statistic" title="Xem Thống Kê"></MenuItem>
                <MenuItem icon={<SearchIcon />} to="searchcar" title="Tra Cứu thông tin xe"></MenuItem>
                <MenuItem icon={<SearchIcon />} to="carlist" title="Lịch sử đăng kiểm"></MenuItem>
                <MenuItem icon={<SearchIcon />} to="Upload" title="Upload File"></MenuItem>
            </div>
            <div className={cx('main')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Cucdangkiem;
