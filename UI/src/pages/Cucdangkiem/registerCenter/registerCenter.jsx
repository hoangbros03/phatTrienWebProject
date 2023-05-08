import { Outlet, useParams } from 'react-router-dom';
import styles from './registerCenter.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button, message, Space } from 'antd';
import * as API from '~/services/searchService';
import Item from 'antd/es/list/Item';
const cx = classNames.bind(styles);
function RegisterCenter() {
    let { user } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = useState({ status: 'unsent' });
    const [formtext, setFromtext] = useState({
        title1: { title: 'Tên Trung Tâm', sub: 'Trung tâm Âu Lạc' },
        title2: { title: 'Tên tài khoản', sub: 'Ttdk9999' },
        title3: { title: 'Mật khẩu', sub: 'password' },
        title4: { title: 'Nhập lại mật khẩu', sub: 'confirm password' },
        title5: { title: 'Địa chỉ', sub: 'Hà Nội' },
        title6: { title: 'Số điện thoại ', sub: '0986924536' },
    });
    const provinces = [
        "Hà Nội",
        "Vĩnh Phúc",
        "Bắc Ninh",
        "Quảng Ninh",
        "Hải Dương",
        "Hải Phòng",
        "Hưng Yên",
        "Thái Bình",
        "Hà Nam",
        "Nam Định",
        "Ninh Bình",
        "Thanh Hóa",
        "Nghệ An",
        "Hà Tĩnh",
        "Quảng Bình",
        "Quảng Trị",
        "Thừa Thiên Huế",
        "Đà Nẵng",
        "Quảng Nam",
        "Quảng Ngãi",
        "Bình Định",
        "Phú Yên",
        "Khánh Hòa",
        "Ninh Thuận",
        "Bình Thuận",
        "Kon Tum",
        "Gia Lai",
        "Đắk Lắk",
        "Đắk Nông",
        "Lâm Đồng",
        "Bình Phước",
        "Tây Ninh",
        "Bình Dương",
        "Đồng Nai",
        "Bà Rịa - Vũng Tàu",
        "Hồ Chí Minh",
        "Long An",
        "Tiền Giang",
        "Bến Tre",
        "Trà Vinh",
        "Vĩnh Long",
        "Đồng Tháp",
        "An Giang",
        "Kiên Giang",
        "Cần Thơ",
        "Hậu Giang",
        "Sóc Trăng",
        "Bạc Liêu",
        "Cà Mau",
        "Lào Cai",
        "Yên Bái",
        "Điện Biên",
        "Hoà Bình",
        "Lai Châu",
        "Sơn La",
        "Hà Giang",
        "Cao Bằng",
        "Tuyên Quang",
        "Thái Nguyên",
        "Lạng Sơn",
        "Bắc Kạn",
        "Bắc Giang",
        "Phú Thọ",
        "Điện Biên Phủ"
      ];
    const [listCenter,setListCenter]=useState([]);    
    useEffect(()=>{
        const res = async () => {
            (async () => {
              const response = await API.getList("http://localhost:3500/cucDangKiem/:user/center",{user:user})  
              const dataArray = JSON.parse(response);
              const result=dataArray.map(({ name, user }) => ({ name, user }))
              setListCenter(result);
            })();
          };
        res()
    },[])

    const [registerCenter, setRegisterCenter] = useState({
        user: '',
        password: '',
        regionName: '',
        name: '',
        forgotPassword:false,
        refreshToken:"U2FsdGVkX1+jEJ1MjFdI6Uf2QoAvW"
    });
    const warningfill = () => {
        messageApi.open({
          type: 'warning',
          content: 'Hãy điền đầy đủ thông tin yêu cầu',
        });
      };
    const warningcheck = () => {
        messageApi.open({
          type: 'warning',
          content: 'Hãy xem lại mật khẩu',
        });
      };
      const warningprovince= () => {
        messageApi.open({
          type: 'warning',
          content: 'Hãy nhập đúng tên tỉnh',
        });
      };
      const warningcondition = () => {
        messageApi.open({
          type: 'warning',
          content: 'Mật khâủ ngắn nhất 6 kí tự',
        });
      };
      const key = 'updatable';
      const openMessage = () => {
        messageApi.open({
          key,
          type: 'loading',
          content: 'Loading...',
        });
        setTimeout(() => {
          messageApi.open({
            key,
            type: 'success',
            content: 'Loaded!',
            duration: 2,
          });
        }, 500);
      };

      
      const duplicater = () => {
        messageApi.open({
          type: 'error',
          content: 'Tài khoản hoặc tên trung tâm đã được sử dụng',
        });
      };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name=="") return;
        setRegisterCenter({ ...registerCenter, [name]: value });
    };

    const handleStandardized = (e) => {
        e.target.value = e.target.value
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        if(e.target.name=="name") checkName(e);
        if(e.target.name=="regionName") checkProvince(e);
    };
    const checkName=(e)=>{
        const check=e.target.value.toLowerCase();
        const res= listCenter.filter((center)=> {  
            return center.name.toLowerCase()==check})
        if(res.length>0) duplicater();
        else return;
    }
    const checkProvince=(e)=>{
        const check=e.target.value.toLowerCase();
        const res= provinces.filter((province)=> {  
            return province.toLowerCase()==check})
        if(res.length>0) return;
        else warningprovince();
    }
    const handleCheckDulplicate=(e)=>{
        const check=e.target.value.toLowerCase();
        const res= listCenter.filter((center)=> {  
            return center.user.toLowerCase()==check})
        if(res.length>0) duplicater();
        else return;
    }
    const handleBack = () => {
        setStatus({...status,status:'unsent'});
       
    };

    const handleSubmit = async (e) => {
        const inputs = document.querySelectorAll('input[required]');
        let isValid = true;
        let centerTmp = {};
        inputs.forEach((input) => {
            let { name, value } = input;
            if (name != '') centerTmp = { ...centerTmp, [name]: value };

            if (!input.value.trim()) {
                isValid = false;
            }
        });
        if (!isValid) {
            warningfill()
            return;
        }
        //check resgister password
        if (inputs[2].value.length < 6) {
            warningcondition()
            return;
        }

        if (inputs[2].value != inputs[3].value) {
            warningcheck()
            return;
        } 
        else {
            inputs.forEach((input) => {
                input.value = '';
            });
            openMessage();
            console.log(registerCenter);
            const respone = await API.createCenter("cucDangKiem/:user/center",
                {user:user },
                {...registerCenter}
            );
            console.log(respone)
            if(respone?.success!=undefined)
            setStatus({status,status:"success"})
            else setStatus({status,status:"failure"})
            
        }

    };
    const renderForm = () => {
        // console.log(status.status=="unsent")
        if (status.status == 'unsent')
            return (
                <div className={cx('container')}>
                    <form className={cx('form')}>
                        <div className={cx('title-signup')}>Đăng kí trung tâm</div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title1.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title1.sub}
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleStandardized}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title2.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title2.sub}
                                    name="user"
                                    onBlur={handleCheckDulplicate}
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title3.title}</p>
                                <input
                                    type="password"
                                    className={cx('input')}
                                    placeholder={formtext.title3.sub}
                                    name="password"
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title4.title}</p>
                                <input
                                    type="password"
                                    className={cx('input')}
                                    placeholder={formtext.title4.sub}
                                    onChange={handleChange}
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className={cx('signup-form')}>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title5.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    name="regionName"
                                    placeholder={formtext.title5.sub}
                                    onChange={handleChange}
                                    onBlur={handleStandardized}
                                    required
                                ></input>
                            </div>
                            <div className={cx('signup-div')}>
                                <p>{formtext.title6.title}</p>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    placeholder={formtext.title6.sub}
                                    onChange={handleChange}
                                    required
                                ></input>
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
                    <div className={cx('content')}>{`Đã Đăng kí thành công Trung tâm  ${registerCenter?.name}`}</div>
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
                    <div className={cx('content')}>{`Đã không thể Đăng kí thành công ${registerCenter?.name}`}</div>
                    <div className={cx('button')} onClick={handleBack}>
                        Quay lại
                    </div>
                </div>
            );
        else return null;
    };
    
    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            {renderForm()}
            {renderSucess()}
            {renderFailure()}
        </div>
    );
}

export default RegisterCenter;
