import React from 'react';
import { Line } from 'react-chartjs-2';
import { useState } from "react";
import HeaderBar from '../../../components/HeaderBar/HeaderBar.jsx';
import styles from './predict.module.scss';
import { predictOptions } from './statisticData.js';
import 'chart.js/auto';

const ttdkList = {
    'Hà Nội': [
        'Trung tâm đăng kiểm xe cơ giới 2901V',
        'Trung tâm đăng kiểm xe cơ giới 2903V',
        'Trung tâm đăng kiểm xe cơ giới 2904V',
        'Trung tâm đăng kiểm xe cơ giới 2906V',
        'Trung tâm đăng kiểm xe cơ giới 2908D',
        'Trung tâm đăng kiểm xe cơ giới 2911D',
        'Trung tâm đăng kiểm xe cơ giới 2927D',
        'Trung tâm đăng kiểm xe cơ giới 2930D',
        'Trung tâm đăng kiểm xe cơ giới 2932D',
        'Trung tâm đăng kiểm xe cơ giới 2933D',
        'Trung tâm đăng kiểm xe cơ giới 2934D',
        'Trung tâm đăng kiểm xe cơ giới 2935D',
        'Trung tâm đăng kiểm xe cơ giới 2936D'
    ],
    'Bắc Ninh': [
        'Trung Tâm đăng kiểm xe cơ giới 9901S',
        'Trạm đăng kiểm xe ô tô 9902S',
        'Trung Tâm đăng kiểm xe cơ giới 9903D',
        'Trạm đăng kiểm xe ô tô 9904D',
        'Trung tâm đăng kiểm xe cơ giới 9905D'
    ],
    'Quảng Ninh': [
        'Trung Tâm đăng kiểm xe cơ giới Hạ Long 1401D',
        'Trung Tâm đăng kiểm xe cơ giới Uông Bí 1402D',
        'Trung Tâm đăng kiểm xe cơ giới Móng Cái 1403D',
        'Trung Tâm đăng kiểm xe cơ giới Móng Cái 1404D',
        'Trung Tâm đăng kiểm xe cơ giới Móng Cái 1405D',
        'Trung Tâm đăng kiểm xe cơ giới Móng Cái 1406D',
        'Trung Tâm đăng kiểm xe cơ giới Móng Cái 1407D'
    ],
    'Thành phố Hồ Chí Minh': [
        'Trung Tâm đăng kiểm xe cơ giới 5006V',
        'Trung Tâm đăng kiểm xe cơ giới 5003V',
        'Chi nhánh đăng kiểm thuộc 5003V',
        'Trung Tâm đăng kiểm xe cơ giới 5004V',
        'Trung Tâm đăng kiểm xe cơ giới 5005V',
        'Chi nhánh đăng kiểm xe cơ giới 5005V',
        'Trung Tâm đăng kiểm xe cơ giới 5007V'
    ]
}


const allType = ['Đăng kiểm mới', 'Đăng kiểm lại'];

function violateMonthBased() {
    alert("Số tháng trong quá khứ phải lớn hơn 3 hoặc và nhỏ hơn 24")
}

function Predict() {
    const [type, setType] = useState(allType[0]);

    function handleType(event) {
        setType(event.target.value);
    }


    const [region, setRegion] = useState('All');

    function handleRegion(event) {
        const selected = event.target.value
        setRegion(selected);
        setRegionTtdk(selected == 'all' ? [] : ttdkList[selected]);
    }


    const [ttdk, setTtdk] = useState('all');
    const [regionTtdk, setRegionTtdk] = useState([]);
    function handleTtdk(event) {
        setTtdk(event.target.value);
    }


    const [monthsBased, setMonthsBased] = useState(5);

    function handleMonthsBased(event) {
        setMonthsBased(event.target.value);
    }

    const [monthsPredict, setMonthsPredict] = useState(2);

    function handleMonthsPredict(event) {
        setMonthsPredict(event.target.value);
    }

    function handleClick() {
        if (monthsBased > 24 || monthsBased < 3) {
            alert('Số tháng trong quá khứ phải lớn hơn 3 và nhỏ hơn 24!');
            return;
        }

        if (monthsPredict < 1 || monthsPredict > 6) {
            alert('Số tháng dự đoán phải lớn hơn 1 và nhỏ hơn 6!');
            return;
        }

        alert(JSON.stringify({
            type: type,
            regionName: region,
            ttdk: ttdk,
            monthsBased: monthsBased,
            monthsPredict: monthsPredict
        }))
    }

    const ouput = [65, 59, 80, 81, 56, 55, 40];

    function setLabel() {
        const today = new Date();

        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        const output = [];

        for (let i = 0; i < monthsPredict; i++) {
            if (month == 12) {
                month = 1;
                year++
            } else { month++ }
            output.push(`T${month} ${year}`);
        }
        return output;
    }

    const predictData = {
        labels: setLabel(),
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

    return (
        <div class={styles.wrapper}>
            <HeaderBar />
            <div class={styles.PredictContainer}>
                <select value={type} onChange={handleType}>
                    {allType.map((selectedType) => (
                        <option key={selectedType} value={selectedType}>
                            {selectedType}
                        </option>
                    ))}
                </select>

                <select value={region} onChange={handleRegion}>
                    <option key='all' value='all'>Cả nước</option>
                    {Object.keys(ttdkList).map((region) => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>

                <select value={ttdk} onChange={handleTtdk}>
                    <option key='all' value='all'>Tất cả trung tâm</option>
                    {regionTtdk.map((ttdk) => (
                        <option key={ttdk} value={ttdk}>
                            {ttdk}
                        </option>
                    ))}
                </select>

                <input type='text' value={monthsBased} onChange={handleMonthsBased} />
                <input type='text' value={monthsPredict} onChange={handleMonthsPredict} />
                <button onClick={handleClick}>click me</button>

                <div>
                    <Line data={predictData} options={predictOptions} />
                </div>
            </div>
        </div>
    );
}

export default Predict;