import { MenuItem } from '~/layouts/SliderBar/Menu';
////
import { Link, Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './cucdangkiem.module.scss';
import classNames from 'classnames/bind';
import { SignUpCenter, StatisticIcon, UploadIcon } from '../../components/Icons';
import { Button, Stack } from '@mui/material';
//Import Icon
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import GradingIcon from '@mui/icons-material/Grading';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const cx = classNames.bind(styles);

//Change sidebar button style here
const buttonStyle = {
    justifyContent: 'flex-start',
    textTransform: 'none',
    height: 50,
    fontSize: 16,
    width: '100%'
}

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
                {/* <MenuItem icon={<HomeIcon />} to={`../${user}`} title="Trở Về Trang Chủ"></MenuItem>
                <MenuItem icon={<SignUpCenter />} to="registerCenter" title="Đăng kí TTĐK"></MenuItem>
                <MenuItem icon={<SignUpCenter />} to="changeInformation" title="Quản lý Trung Tâm"></MenuItem>
                <MenuItem icon={<StatisticIcon />} to="statistic" title="Xem Thống Kê"></MenuItem>
                <MenuItem  to="searchcar" title="Tra Cứu thông tin xe"></MenuItem>
                <MenuItem to="carlist" title="Lịch sử đăng kiểm"></MenuItem>
                <MenuItem to="Upload" title="Upload File"></MenuItem> */}

                <Stack direction="column" spacing={1} sx={{
                    marginTop: 10,
                    marginLeft: 2,
                    marginRight: 3
                }}>
                    <MenuItem icon={<HomeIcon />} to={`../${user}`} >Trang chủ</MenuItem>
                    <MenuItem icon={<PostAddIcon />} to="registerCenter">Thêm trung tâm đăng kiểm</MenuItem>
                    <MenuItem icon={<ManageAccountsIcon />} to="changeInformation">Quản lý trung tâm</MenuItem>
                    <MenuItem icon={<AutoGraphIcon />} to="statistic">Xem thống kê</MenuItem>
                    <MenuItem icon={<ScreenSearchDesktopIcon />} to="searchcar">Tra cứu thông tin xe</MenuItem>
                    <MenuItem icon={<GradingIcon />} to="carlist">Lịch sử đăng kiểm</MenuItem>
                    <MenuItem icon={<UploadFileIcon />} to="Upload">Tải lên thông tin</MenuItem>
                </Stack>
            </div>
            <div className={cx('main')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Cucdangkiem;
