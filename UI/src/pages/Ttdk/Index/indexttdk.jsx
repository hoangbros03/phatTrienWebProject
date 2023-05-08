import { Outlet } from "react-router-dom";
import styles from "./indexttdk.module.scss";
import classNames from 'classnames/bind';
import BarStatistic from '~/components/BarStatistic/BarStatistic';
import { useEffect, useState } from 'react';
import Button from '~/components/Button';
import ButtonSearch from '~/components/ButtonSearch';
const cx = classNames.bind(styles);
function Indexttdk() {
    return (<div className={cx('wrapper')}>


                            <ButtonSearch bar  >
                                Kiểu Xe
                            </ButtonSearch>
                        
    <Outlet/>
    </div>
    );
}

export default Indexttdk;