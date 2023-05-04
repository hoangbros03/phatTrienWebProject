
import { Outlet, useNavigate, useParams,Navigate  } from 'react-router-dom';
import styles from './user.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { useDispatch, useSelector } from 'react-redux';

import navLogo from "../../assets/images/navLogo.png";
import Header from '../../components/HeaderBar/HeaderBar';
const cx = classNames.bind(styles);

function User() {
    const User_ = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const { user } = useParams();
    const test = () => {
        console.log(User);
    };

        console.log(User_)
        // if (User_.user == null)  {
        //     console.log('kkk')
        // return <Navigate to='../../login'  />;}
        
        
        // return (<div>
        //     <div className={cx('wrapper')}>
        //         <div className={cx('inner')}>
        //             <div className={cx('logo')}>Logo</div>
        //             <Button text large primary onClick={test}>
        //                 {user}
        //             </Button>
        //         </div>
        //     </div>
        //     <Outlet />
        // </div>);
        return (
            <div className={cx('wrapper')}>
            <Header user={true}/>
            <Outlet />
            </div>
        );

}

export default User;
