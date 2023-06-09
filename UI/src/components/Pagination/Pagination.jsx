import { Outlet } from 'react-router-dom';
import styles from './Pagination.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Pagination as MUIpag } from '@mui/material';

const cx = classNames.bind(styles);
function Pagination({ totalPosts, postsPerPage, setCurrentPage, currentPage }) {

    let pages = [];


    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }

    const handlePageChange = function (event, value) {
        setCurrentPage(value);
    }

console.log('page: ', pages);
    return (
        <div className={cx('pagination')}>
            <MUIpag count={pages.length} page={currentPage} onChange={handlePageChange} siblingCount={0}/>
        </div>
    );
}

export default Pagination;
