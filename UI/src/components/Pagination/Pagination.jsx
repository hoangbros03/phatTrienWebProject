import { Outlet } from 'react-router-dom';
import styles from './Pagination.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
const cx = classNames.bind(styles);
function Pagination({ totalPosts, postsPerPage, setCurrentPage, currentPage }) {
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    // const handleClick = (event) => {
    //     setCurrentPage(Number(event.target.id));
    //   };
    let pages = [];
    const handleNextbtn = () => {
        setCurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    const handlePrevbtn = () => {
        setCurrentPage(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit == 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }
    let pageIncrementBtn = null;
    
    if (pages.length > maxPageNumberLimit) {
        
        pageIncrementBtn = <div onClick={handleNextbtn} > &hellip; </div>;
    }

    let pageDecrementBtn = null;
    if (minPageNumberLimit >= 1) {
        pageDecrementBtn = <div onClick={handlePrevbtn}> &hellip; </div>;
    }
    

    return (
        <div className={cx('pagination')}>
            <button onClick={handlePrevbtn} disabled={currentPage == pages[0] ? true : false} className={cx('button')}>
                Prev
            </button>
            {pageDecrementBtn}
            {pages.map((page, index) => {
                if (page < maxPageNumberLimit + 1 && page > minPageNumberLimit) {
                    return (
                        <div
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`${page === currentPage ? cx('active') : ''} ${cx('button')}`}
                        >
                            {page}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
            {pageIncrementBtn}
            <button onClick={handleNextbtn} disabled={currentPage == pages[pages.length - 1] ? true : false}  className={cx('button')}>
                Next
            </button>
        </div>
    );
}

export default Pagination;
