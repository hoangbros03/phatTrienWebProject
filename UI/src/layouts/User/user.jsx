import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import styles from './user.module.scss';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/HeaderBar/HeaderBar';
import * as API from '~/services/Auth';
import store from '../../redux/store';
import { setAccessToken } from '../../auth/Auth';
const cx = classNames.bind(styles);

function User() {
    
    const dispatch = useDispatch();

    //   //check login ??
    if (store.getState().auth.user == null) {
        ;(async () => {
            const response = await API.refresh('/refresh');
            console.log(response)
            if (response?.accessToken == null) {
            } else {
                await dispatch(setAccessToken(response));
            }
            if ( store.getState().auth.user == null) {
                console.log(store.getState().auth);
                return <Navigate to="../../../" />;
            }
          })();
    }
    
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
            <Header user={true} />
            <Outlet />
            
        </div>
    );
}

export default User;
