import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import styles from './statisticTest.module.scss';
import { provincialOptions, propotionOptions, quarterOptions, predictOptions } from './statisticData.js';
import 'chart.js/auto';
import * as API from '../../../services/searchService.js';
import { Dialog, Slide, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const colors = ['#ffa600', '#094780', '#744ec2', '#ef5675', '#16a085'];
const carTypes = [
    "xe con",
    "xe tải",
    "xe khách",
    "xe chuyên dùng",
    "xe bán tải",
];

//for dialog animation
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//This object is a place holder for data fetched
function StatisticCDK() {
    const [statistic, setStatistic] = useState({
        propotion: {
            data: [32510, 5127, 1233, 6561, 4152]
        },
        topProvinces: {
            provinces: ["TP Hồ Chí Minh", "Hà Nội", "Hải Phòng", "Đà Nẵng", "Quảng Ninh", "Cần Thơ", "Bắc Ninh"],
            data: [1624, 745, 451, 102, 101, 95, 12]
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
    });

    // //Fetch data from server
    // useEffect(() => {
    //     const res = async () => {
    //         (async () => {
    //             const response = await API.get("/trungTamDangKiem/:user/statistic")
    //             console.log("KKKK");
    //         //oong check data o day
    //         console.log(response);
    //         setStatistic(response);
    //         })();
    //     };
    //     res()
    //     // const fetchData = async () => {
    //     //     const data = await API.get('/trungTamDangKiem/:user/statistic');

    //     //   }
    //     // fetchData();

    // }, [])



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
        labels: statistic.topProvinces.provinces,
        datasets: [{
            label: 'Số lượng xe đăng kiểm',
            backgroundColor: '#094780',
            data: statistic.topProvinces.data
        }]
    }

    // console.log(statistic.topProvinces.provinces)

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
        labels: ["Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11"],
        datasets: [
            {
                label: "Số lượng xe dự đoán",
                data: [6645, 5899, 8012, 8156, 5645, 5521],
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

    //dialog
    const [open, setOpen] = React.useState(false);
    const [selectedChart, setSelectedChart] = useState(null);
    const handleClickOpen = (chart) => {
        setSelectedChart(chart);
        setOpen(true);
    };

    const handleDialogClose = (chart) => {
        setOpen(false);
    };

    return (
        <div>
            <div className={styles.statisticContainer}>
                <div className={styles.PieContainer} onClick={() => handleClickOpen(
                    <Pie data={propotionData} options={propotionOptions} style
                    = {{"width": "600px",
                        "height" : "400px"
                    }}
                    />
                )}>
                    <Pie data={propotionData} options={propotionOptions} />
                </div>

                <div className={styles.BarContainer} onClick={() => handleClickOpen(
                    <Bar data={provincialData} options={provincialOptions} style
                    = {{"width": "600px",
                        "height" : "400px"
                    }}/>
                )}>
                    <Bar data={provincialData} options={provincialOptions} />
                </div>

                <div className={styles.LineContainer} onClick={() => handleClickOpen(
                    <Line data={quarterData} options={quarterOptions} style
                    = {{"width": "600px",
                        "height" : "400px"
                    }}/>
                )}>
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
                    <h3>{total} Xe đã đăng ký</h3>
                </div>

                <div className={styles.Predict} onClick={() => handleClickOpen(
                    <Line options={predictOptions} data={predictData} style
                    = {{"width": "600px",
                        "height" : "400px"
                    }}/>
                )}>
                    <Line options={predictOptions} data={predictData} />
                </div>

                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDialogClose}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="xl"
                >
                    <DialogTitle>Lịch sử đăng kiểm</DialogTitle>
                    <DialogContent>
                            {selectedChart}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default StatisticCDK