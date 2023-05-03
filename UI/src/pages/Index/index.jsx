import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import Image from '../../components/Image';
import Button from '../../components/Button';
import Header from '../../components/HeaderBar/HeaderBar.jsx';

const cx = classNames.bind(styles);
function Index() {
    return (
        <div>
            <Header styles={{zIndex: '2'}}/>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('slider')}>
                        <div className={cx('content')}>
                            <h1 >
                                Uy tín, chất lượng, chuyên nghiệp và hiện đại!
                            </h1>
                            <p>
                                Đảm bảo dịch vụ nhanh chóng, chu đáo và đảm bảo quy chuẩn giao thông
                            </p>
                            <div className={cx('function')}>
                                <Button primary rounded to="register">
                                    Đăng Kí
                                </Button>
                                <Button primary rounded to="login">
                                    Đăng Nhập
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('main')}>
                        <img className={cx('image')} src={images.indexImage} alt="anh loi"></img>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default Index;
