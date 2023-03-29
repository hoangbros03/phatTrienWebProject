
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BtnBar from "../../components/BtnBar";
import styles from './cucdangkiem.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Cucdangkiem() {
    const navigate = useNavigate();
    const {user}=useParams();
    const backtohomepage =()=>{
        navigate(`../${user}`)
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sliderbar')} style={{ paddingTop: 16 }}>
                <BtnBar large onClick={backtohomepage}>
                    Trở Về Trang Chủ
                </BtnBar>
                <BtnBar large to="registerCenter">
                    Đăng kí Trung Tâm Đăng Kiểm
                </BtnBar>
                <BtnBar large to="changeInformation">
                    Thay đổi Thông Tin
                </BtnBar>
                <BtnBar large to="statistic">
                    Xem Thống Kê
                </BtnBar>
                <BtnBar large to="Upload">
                    Upload File
                </BtnBar>
            </div>
            <Outlet />
        </div>
    );
}

export default Cucdangkiem;
