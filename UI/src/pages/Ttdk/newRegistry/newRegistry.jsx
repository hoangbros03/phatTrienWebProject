import { Outlet } from "react-router-dom";
import styles from "./newRegistry.module.scss";
import classNames from 'classnames/bind';
import React, { useState } from 'react';
const cx = classNames.bind(styles);
function NewRegistry() {
    
    
    const [ttdk,setTtdk]=useState({name:"",username:"",password:"",checkpassword:"",email:"",phone:"",brief:""})
    const [status
        ,setStatus
    ]=useState({status:"unsent"})

    const handleChange =(e)=>{
        const {name,value}=e.target
        setTtdk({...ttdk,[name]:value})
    }

    const handleSubmit= (e)=>{
        e.preventDefault()

        console.log(ttdk);
        
    } 
    const renderForm=()=>{
        console.log(status.status=="unsent")
        if(status.status=="unsent") return (<div className={cx('container')}>
           
        </div>);
        else return null;
    }
    
    const renderSucess=()=>{
        if(status.status=="sucess") return (<div className={cx('container',"sucess",'respone')}>
            <div className={cx('title')}>Thành Công</div>
            <div className={cx('content')}>{`Đã Đăng kí thành công Trung tâm đăng kiểm ${ttdk.name}`}</div>
        </div>);
        else return null;

    }
    const renderFailure=()=>{
        if(status.status=="failure") return (<div className={cx('container',"failure",'respone')}>
            <div className={cx('title')}>Có lỗi đã xảy ra</div>
            <div className={cx('content')}>{`Đã không thể Đăng kí thành công Trung tâm đăng kiểm ${ttdk.name}`}</div>
        </div>);
        else return null;

    }
    return (
        <div className={cx('wrapper')}>
            {renderForm()}
            {renderSucess()}
            {renderFailure()}
        </div>
        
    );
}

export default NewRegistry;