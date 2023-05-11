import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useState } from "react";
import HeaderBar from '../../../components/HeaderBar/HeaderBar.jsx';
import styles from './statisticTest.module.scss';
import { provincialOptions, propotionOptions, quarterOptions, predictOptions } from './statisticData.js';
import 'chart.js/auto';

const statistic = {
    propotion: {
        data: [30000, 5000, 1000, 6000, 4000]
    },
    topProvinces: {
        provinces: ["TP Hồ Chí Minh", "Hà Nội", "Hải Phòng", "Đà Nẵng", "Quảng Ninh", "Cần Thơ", "Bắc Ninh"],
        data: [1000, 600, 350, 100, 100, 80, 10]
    },
    quarter: {
        quarter: ["Q2 2021", "Q3 2021", "Q4 2021", "Q1 2022", "Q2 2022", "Q3 2022", "Q4 2022", "Q1 2023"],
        data: [
            [2350, 2495, 2507, 2417, 2619, 2845, 2711, 2940],
            [1312, 1487, 1561, 1424, 1561, 1790, 1641, 1745],
            [307, 426, 590, 414, 691, 736, 726, 810],
            [342, 416, 569, 425, 641, 887, 671, 895],
            [1368, 1485, 1571, 1420, 1541, 1893, 1619, 1817]
        ]
    }
}

const colors = ['#ffa600', '#094780', '#744ec2', '#ef5675', '#16a085'];
const carTypes = [
    "xe con",
    "xe tải",
    "xe khách",
    "xe chuyên dùng",
    "xe bán tải"
];

function StatisticTest() {
    const [propotionData, setPropotionData] = useState({
        labels: carTypes,
        datasets: [{
            label: 'Số lượng đăng kiểm',
            data: statistic.propotion.data,
            backgroundColor: colors,
            hoverOffset: 4
        }],
        total: statistic.propotion.data.reduce((a, b) => a + b, 0)
    });

    const [provincialData, setProvincialData] = useState({
        labels: statistic.topProvinces.provinces,
        datasets: [{
            label: 'Số lượng xe đăng kiểm',
            backgroundColor: '#094780',
            data: statistic.topProvinces.data
        }]
    })

    const quarter = {
        labels: statistic.quarter.quarter,
        datasets: []
    };

    for (let i = 0; i < carTypes.length; i++) {
        const carTypeStatistic = {
            label: carTypes[i],
            data: statistic.quarter.data[i],
            borderColor: colors[i],
            fill: false,
            tension: 0
        }

        quarter.datasets.push(carTypeStatistic);
    }

    const [quarterData, setQuaterData] = useState(quarter);

    function handleClick() {
        setPropotionData({
            labels: carTypes,
            datasets: [{
                label: 'Số lượng đăng kiểm',
                data: [30000, 5000, 1000, 6000, 15000],
                backgroundColor: colors,
                hoverOffset: 4
            }],
            total: statistic.propotion.data.reduce((a, b) => a + b, 0)
        }
        )
    }

    //Predict 

    const predictData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First Dataset",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                borderDash: [5, 5]
            },
        ],
    };

    //Total
    const [total, setTotal] = useState(statistic.propotion.data.reduce((a, b) => a + b, 0));
    const [type, setType] = useState('all');
    const [time, setTime] = useState('all');

    const handleType = function (event) {
        setType(event.target.value);
        setTotal(calculateTotal(event.target.value, time));
    }

    const handleTime = function (event) {
        setTime(event.target.value)
        setTotal(calculateTotal(type, event.target.value));
    }

    const calculateTotal = function(type, time) {
        if(time == 'all' && type == 'all') {
            return statistic.propotion.data.reduce((a, b) => a + b, 0);
        }

        if(type == 'all') {
            let sum = 0;
            for(let i = 0; i < carTypes.length; i++) {
                sum += statistic.quarter.data[i][statistic.quarter.quarter.indexOf(time)]
            } 
            return sum;
        }

        if(time == 'all') {
            return statistic.quarter.data[carTypes.indexOf(type)].reduce((a,b) => a+b, 0);
        }

        return statistic.quarter.data[carTypes.indexOf(type)][statistic.quarter.quarter.indexOf(time)]
    }

    return (
        <div>
            <HeaderBar />
            <div className={styles.statisticContainer}>
                <div className={styles.PieContainer}>
                    <Pie data={propotionData} options={propotionOptions} />
                </div>

                <div className={styles.BarContainer}>
                    <Bar data={provincialData} options={provincialOptions} />
                </div>

                <div className={styles.LineContainer}>
                    <Line data={quarterData} options={quarterOptions} />
                </div>

                <div className={styles.Total}>
                    <h5>Tổng số phương tiện đã đăng ký</h5>
                    <select value={type} onChange={handleType}>
                        <option key="all" value="all">Tất cả phương tiện</option>
                        {carTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <select value={time} onChange={handleTime}>
                        <option key="all" value="all">Tổng số</option>
                        {statistic.quarter.quarter.map((q) => (
                            <option key={q} value={q}>
                                {q}
                            </option>
                        ))}
                    </select>

                    <h3>{total} xe đã đăng ký</h3>
                </div>

                <div className={styles.Predict}>
                    <Line options={predictOptions} data={predictData}></Line>
                </div>
            </div>
        </div>
    )
}

export default StatisticTest