import { Outlet } from "react-router-dom";
import aboutGif from "../../assets/images/About.gif";
import styles from "./about.module.scss";
import classNames from 'classnames/bind';


const cx = classNames.bind(styles);
const ghSource = "https://github.com/hoangbros03/phatTrienWebProject.git";

function About() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Giới thiệu trang web đăng kiểm Careg</h1>
                <br />
                <p>
                    <section>
                        Ứng dụng web được thiết kế bởi Trần Bá Hoàng, Nguyễn Văn Hùng và Lê Quý Dương 
                        phục vụ Bài tập lớn môn Phát triển ứng dụng Web.
                    </section>
                    <br />
                    <section>
                        Trang web sử dụng framework <code style={{color: 'deepskyblue'}}>ReactJS</code> cho Front-end,
                        <code style={{color: 'green'}}>NodeJS</code> cho Back-end và <code style={{color: 'darksalmon'}}>
                        MongoDB</code> cho tầng cơ sở dữ liệu.
                    </section>
                    <br />
                    <section>
                        Dữ liệu trong ứng dụng được tạo ra một cách ngẫu nhiên.
                    </section>
                    <br />
                    <section>
                        Xem mã nguồn của dự tại án: 
                        <a href={ghSource} target="_blank"><code style={{color: 'indigo'}}> Mã nguồn trên Github</code></a>
                    </section>
                </p>
            </div>

            <div className={styles.animated}>
                <img src={aboutGif} alt="gif"></img>
            </div>
        </div>
    );
}

export default About;