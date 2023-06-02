import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import HeaderBar from '../../../components/HeaderBar/HeaderBar.jsx';
import styles from './statisticTest.module.scss';
import { provincialOptions, propotionOptions, quarterOptions, predictOptions } from './statisticData.js';
import 'chart.js/auto';
import { get } from '../../../services/searchService.js';

const colors = ['#ffa600', '#094780', '#744ec2', '#ef5675', '#16a085'];
const carTypes = [
    "xe con",
    "xe tải",
    "xe khách",
    "xe chuyên dùng",
    "xe bán tải",
];


//This object is a place holder for data fetched
function StatisticTest() {
    const [statistic, setStatistic] = useState({
        propotion: {
            data: []
        },
        topProvinces: {
            provinces: [],
            data: []
        },
        quarter: {
            quarter: [],
            data: [
                [],
                [],
                [],
                [],
                []
            ]
        },
    });

    //Fetch data from server
    useEffect(() => {
        get('/trungTamDangKiem/:user/statistic')
            .then(data => {
                // Assign the fetched data to the object
                setStatistic(data);
            })
            .catch(error => console.error(error));
    }, [])

    console.log(statistic);

    //Config data for Car's propotion chart
    const propotionData = {
        labels: carTypes,
        datasets: [{
            label: 'Số lượng đăng kiểm',
            data: statistic.propotion.data,
            backgroundColor: colors,
            hoverOffset: 4
        }],
        total: statistic.propotion.data.reduce((a, b) => a + b, 0)
    };

    //Config data for provincial chart
    const provincialData = {
        labels: statistic.topProvinces.province,
        datasets: [{
            label: 'Số lượng xe đăng kiểm',
            backgroundColor: '#094780',
            data: statistic.topProvinces.data
        }]
    }

    console.log(statistic.topProvinces.provinces)

    const quarterData = {
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

        quarterData.datasets.push(carTypeStatistic);
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

    const calculateTotal = function (type, time) {
        if (time == 'all' && type == 'all') {
            return statistic.propotion.data.reduce((a, b) => a + b, 0);
        }

        if (type == 'all') {
            let sum = 0;
            for (let i = 0; i < carTypes.length; i++) {
                sum += statistic.quarter.data[i][statistic.quarter.quarter.indexOf(time)]
            }
            return sum;
        }

        if (time == 'all') {
            return statistic.quarter.data[carTypes.indexOf(type)].reduce((a, b) => a + b, 0);
        }

        return statistic.quarter.data[carTypes.indexOf(type)][statistic.quarter.quarter.indexOf(time)]
    }

    return (
        <div>
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