import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import Button from '../../components/Button';
import Header from '../../components/HeaderBar/HeaderBar.jsx';
import * as API from '~/services/Auth';
import store from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../../auth/Auth';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);
function Index() {
    return (
        <div>
            <Header/>
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
                                <Button primary rounded to="login">
                                    Đăng Nhập
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('main')}>
                    <img className={cx('image')} src={images.indexImage} alt="anh loi"></img>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Index;
