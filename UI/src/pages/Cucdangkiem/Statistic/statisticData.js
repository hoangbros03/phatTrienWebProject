const propotionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Thị phần xe theo công năng sử dụng'
        }
    }
}


const provincialOptions = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: 'y', 
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    plugins: {
        title: {
            display: true,
            text: 'Top  7 tỉnh thành có số lượng đăng ký lớn nhất'
        }
    }
}


const quarterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Thống kê số lượng xe đăng ký qua các quý'
        }
    }
}

const predictOptions = {
    maintainAspectRatio: false,
    scales: {
        y: {
          beginAtZero: true,
        },
      },

      plugins: {
        title: {
            display: true,
            text: 'Dự đoán số lượng xe'
        },
        legend: {
            display: false
        }
    }
}
export { propotionOptions, provincialOptions, quarterOptions, predictOptions};
