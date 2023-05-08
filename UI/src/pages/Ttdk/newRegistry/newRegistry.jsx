import { Outlet } from 'react-router-dom';
import styles from './newRegistry.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
const cx = classNames.bind(styles);
function NewRegistry() {
  
    const [status, setStatus] = useState({ status: 'success' });

    const [formtext,setFromtext]=useState({title1:{title:"Biển số xe",sub:"99A 99999"},
    title8:{title:"Ngày đăng kí",sub:"21/2/2023"},
    title9:{title:"Ngày hết hạn",sub:"21/2/2024"},
})
    const [carResgiter,setCarRegister] =useState(
        {
            "licensePlate": "",      
            "dateOfIssue": "",
            "dateOfExpiry":""
        }
    )

    const handleChange = (e) => {
        const { name, value,type} = e.target;
        if(type=="date")
        {var date = new Date(value);
        const iso = date.toISOString();
        setCarRegister({ ...carResgiter, [name]: iso });}
        else setCarRegister({ ...carResgiter, [name]: value });
    };
    const handleBack = () => {
        setStatus({...status,status:'unsent'});
       
    };

    const handleSubmit = (e) => 
        {   const inputs = document.querySelectorAll('input[required]');
        let isValid = true;
    
        inputs.forEach((input) => {
        if (!input.value.trim()) {
            isValid = false;
        }
        });
    
        if (!isValid) {
        alert('Please fill in all required fields');
      return;
    }
        console.log(carResgiter)
    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        if (status.status == 'unsent')
            return (
                <div className={cx('container')}>
                    <form className={cx('form')}>
                        <div className={cx('title-signup')}>Thêm mẫu đăng kiểm mới</div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title1.title}</p>
                                <input type="text" className={cx('input')}  placeholder={formtext.title1.sub} name='licensePlate' onChange={handleChange} required></input>
                            </div>
                

                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title8.title}</p>
                                <input type="date" className={cx('input')}  placeholder={formtext.title8.sub} name="dateOfIssue" onChange={handleChange} required></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title9.title}</p>
                                <input type="date" className={cx('input')}  placeholder={formtext.title9.sub} name="dateOfExpiry" onChange={handleChange} required></input>
                            </div>
                          
                        </div>
                        
                        <div className={cx('signup-form')}>
                            <div className={cx('submit')} onClick={handleSubmit}>
                                Xác Nhận 
                            </div>
                            
                        </div>
                    </form>
                </div>
            );
        else return null;
    };

    const renderSucess = () => {
        if (status.status == 'success')
            return (
                <div className={cx('container', 'success', 'respone')}>
                    <div className={cx('title')}>Thành Công</div>
                    <div className={cx('content')}>{`Đã Đăng kí thành công Xe ${carResgiter?.licensePlate}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    const renderFailure = () => {
        if (status.status == 'failure')
            return (
                <div className={cx('container', 'failure', 'respone')}>
                    <div className={cx('title')}>Có lỗi đã xảy ra</div>
                    <div
                        className={cx('content')}
                    >{`Đã không thể Đăng kí thành công Trung tâm đăng kiểm${carResgiter?.licensePlate}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    return (
        <div className={cx('wrapper')}>
            {renderForm()}
            {renderSucess()}
            {renderFailure()}
        </div>
    );
}

export default NewRegistry;
