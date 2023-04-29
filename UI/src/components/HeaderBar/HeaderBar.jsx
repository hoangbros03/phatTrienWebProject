import './HeaderBar.scss';
import navLogo from "../../assets/images/navLogo.png";

function Header() {
    return (
        <nav>
            <ul>
                <li id="logo"><img src={navLogo} alt="logo" /></li>
                <li><a href="">Trang chủ</a></li>
                <li><a href="statistic">Thống kê</a></li>
                <li><a href="contact">Liên hệ</a></li>
                <li><a href="about">Giới thiệu</a></li>

                <li id="signup" className="button"><a href="signup">Đăng ký</a></li>
                <li id="login" className="button"><a href="login">Đăng nhập</a></li>
            </ul>
        </nav>
    );
}

export default Header;