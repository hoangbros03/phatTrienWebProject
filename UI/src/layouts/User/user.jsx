import { Outlet, useParams } from "react-router-dom";
import styles from "./user.module.scss";
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);
function User() {

    const {user}=useParams()
    const test=()=>{
        console.log(user)
    }
    return (
    <div>
    
    <div className={cx('wrapper')}>
        <div className={cx('inner')}>
        <div className={(cx('logo'))}>Logo</div>
        <Button text large primary onClick={test}>{user}</Button>
        </div>
    </div>
    <Outlet/>
    </div>
    );
}

export default User;