import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BtnBar from "../../components/BtnBar";

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
            <div className={cx('sliderbar')} style={{ paddingTop: 16 }}>
                <BtnBar large onClick={backtohomepage}>
                    Trở Về Trang Chủ
                </BtnBar>
                <BtnBar large to="newRegistry">
                    Đăng kiểm Ô tô
                </BtnBar>
                <BtnBar large to="lookup">
                    Tra cứu Thông Tin xe
                </BtnBar>
                <BtnBar large to="statistic">
                    Xem Thống Kê Xe
                </BtnBar>
            </div>
            <Outlet />
        </div>
    );
}

export default Ttdk;