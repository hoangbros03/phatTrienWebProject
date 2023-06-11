import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MenuItem } from '~/layouts/SliderBar/Menu';
import styles from "./ttdk.module.scss";
import classNames from 'classnames/bind';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import GradingIcon from '@mui/icons-material/Grading';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Stack } from '@mui/material';

const cx = classNames.bind(styles);
function Ttdk() {
    const navigate = useNavigate();
    const {user}=useParams();
    const backtohomepage =()=>{
        navigate(`../${user}`)
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sliderbar')} >
            <Stack direction="column" spacing={1} sx={{
                    marginTop: 10,
                    marginLeft: 2,
                    marginRight: 3
                }}>
                    <MenuItem icon={<HomeIcon />} to={`../${user}`} >Trang chủ</MenuItem>
                    <MenuItem icon={<CarCrashIcon />} to="newRegistry">Đăng kiểm</MenuItem>
                    <MenuItem icon={<DirectionsCarIcon />} to="newRegistrycar">Đăng ký phương tiện</MenuItem>
                    <MenuItem icon={<AutoGraphIcon />} to="statistic">Xem thống kê</MenuItem>
                    <MenuItem icon={<GradingIcon />} to="carlist">Lịch sử đăng kiểm</MenuItem>
                    <MenuItem icon={<ManageAccountsIcon />} to="changepassword">Đổi mật khẩu</MenuItem>
                </Stack>
            </div>
            <div className={cx("main")}><Outlet /></div>
            
        </div>
    );
}

export default Ttdk;