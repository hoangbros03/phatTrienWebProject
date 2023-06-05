import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import { Button } from '@mui/material';

const cx = classNames.bind(styles);
const buttonStyle = {
    justifyContent: 'flex-start',
    textTransform: 'none',
    height: 50,
    fontSize: 16,
    width: '100%',
}


function MenuItem({ children, icon ,to }) {
    return (
        <NavLink to={to} >
            <Button startIcon={icon} sx={buttonStyle}>{children}</Button>
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    
};

export default MenuItem;
