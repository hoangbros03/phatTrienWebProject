import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BtnBar from "../../components/BtnBar";
import { MenuItem } from '~/layouts/SliderBar/Menu';
import { HomeIcon, SearchIcon } from '~/components/Icons';
import { SignUpCenter, StatisticIcon,UploadIcon  } from '../../components/Icons';
import styles from "./ttdk.module.scss";
import classNames from 'classnames/bind';
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
                <MenuItem icon={<HomeIcon />} to={`../${user}`} title="Trở Về Trang Chủ"></MenuItem>
                <MenuItem icon={<SignUpCenter />}  to="newRegistry" title="Đăng kiểm">
    
                </MenuItem>
                <MenuItem icon={<HomeIcon />}  to="newRegistrycar" title="Đăng Kí ">
                   
                </MenuItem>
                <MenuItem  icon={<SearchIcon />} to="lookup" title ="Tra cứu Thông Tin xe">
                 
                </MenuItem>
                <MenuItem icon={<HomeIcon />}  to="carlist" title="Xem Thống Kê Xe">
                </MenuItem>
                <MenuItem icon={<HomeIcon />}  to="changepassword" title="Đổi mật khẩu">
                </MenuItem>
            </div>
            <div className={cx("main")}><Outlet /></div>
            
        </div>
    );
}

export default Ttdk;