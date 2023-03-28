//...
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '~/components/Image';
const cx = classNames.bind(styles);
function AccountItem({ data }) {
    return (
        <div to={`/@${data.nickname}`} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data.avatar} alt={data.nickname}></Image>
            <div className={cx('info')}>
                <p className={cx('name')}>
                    <span>{data.first_name}</span>
                    {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCircleCheck}></FontAwesomeIcon>}
                </p>
                <span className={cx('username')}>{data.full_name}</span>
            </div>
        </div>
    );
}

export default AccountItem;
