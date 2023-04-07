import { Outlet } from 'react-router-dom';
import styles from './registerCenter.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { SearchIcon,Close } from '~/components/Icons';
const cx = classNames.bind(styles);
function RegisterCenter() {

    const [ttdk,setTtdk]=useState({name:"",username:"",password:"",checkpassword:"",email:"",phone:"",brief:""})
    const [status
        ,setStatus
    ]=useState({status:"unsent"})
    const handleChange =(e)=>{
        const {name,value}=e.target
        setTtdk({...ttdk,[name]:value})
    }
    const handleClose=()=>{
        setStatus({...status,status:"unsent"});
         
     }

    const handleSubmit= (e)=>{
        e.preventDefault()

        console.log(ttdk);
        
    } 
    const renderForm=()=>{
        
        if(status.status=="unsent") return (<div className={cx('container')}>
          
            <form action="" className={cx('form')} onSubmit={handleSubmit} >
                <div className={cx('column', 'one')}>
                    <div className={cx('field', 'name')}>
                        <label htmlFor="name_">Tên Trung Tâm</label>
                        <input
                            className={cx('input')}
                            type="text"
                            name="name"
                            id="name_"
                            placeholder="Đăng Kí Tên Trung Tâm"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                           
                        />
                    </div>
                    <div className={cx('field', 'username')}>
                        <label htmlFor="Username_">Tài Khoản</label>
                        <input
                            className={cx('input')}
                            type="text"
                            name="username"
                            id="Username_"
                            placeholder="Đăng Kí Tài Khoản"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                        />
                    </div>
                   
                    <div className={cx('field', 'password')}>
                        <label htmlFor="Password_">Mật Khẩu</label>
                        <input
                            className={cx('input')}
                            type="password"
                            name="password"
                            id="Password_"
                            placeholder="Nhập Mật Khẩu"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('field', 'checkpassword')}>
                        <label htmlFor="Password_">Nhập Lại Mật Khẩu</label>
                        <input
                            className={cx('input')}
                            type="password"
                            name="checkpassword"
                            id="checkpassword_"
                            placeholder="Nhập lại mật khẩu"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                        />
                    </div>
                   
                </div>
                <div className={cx('column', 'two')}>
                    <div className={cx('field', 'email')}>
                        <label htmlFor="Email_">email</label>
                        <input
                            className={cx('input')}
                            type="email"
                            name="email"
                            id="Email_"
                            placeholder="type a valid email"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('field', 'phone')}>
                        <label htmlFor="Phone_">phone</label>
                        <input className={cx('input')} type="tel" name="phone" id="Phone_"
                        onChange={handleChange} />
                    </div>
                   
                    <div className={cx('field', 'Brief')}>
                        <label htmlFor="Brief_">brief</label>
                        <textarea className={cx('textarea')}
                         name='brief'
                         onChange={handleChange}
                         ></textarea>
                    </div>
                </div>
                <input type="submit" value="register" className={cx('register','input','submit')} />
            </form>
        </div>);
        else return null;
    }
    
    const renderSucess=()=>{
        if(status.status=="sucess") return (<div className={cx('container',"sucess",'respone')}>
              <div className={cx("icon_close")} onClick={handleClose}><Close width={"2.4rem"} height={"2.4rem"}/></div>
            <div className={cx('title')}>Thành Công</div>
            <div className={cx('content')}>{`Đã Đăng kí thành công Trung tâm đăng kiểm ${ttdk.name}`}</div>
        </div>);
        else return null;

    }
    const renderFailure=()=>{
        if(status.status=="failure") return (<div className={cx('container',"failure",'respone')}>
              <div className={cx("icon_close")} onClick={handleClose}><Close width={"2.4rem"} height={"2.4rem"}/></div>
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

export default RegisterCenter;
