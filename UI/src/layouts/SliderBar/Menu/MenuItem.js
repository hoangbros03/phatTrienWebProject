import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import { Button, useMediaQuery  } from '@mui/material';

const cx = classNames.bind(styles);
const buttonStyle = {
    justifyContent: 'flex-start',
    textTransform: 'none',
    height: 50,
    fontSize: 16,
    width: '100%',
}


function MenuItem({ children, icon ,to }) {
    const isSmDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

    if (isSmDown) {
      return (
        <NavLink to={to}>
          <Button startIcon={icon} sx={buttonStyle} disableElevation />
        </NavLink>
      );
    }
  
    return (
      <NavLink to={to}>
        <Button startIcon={icon} sx={buttonStyle} disableElevation>
          {children}
        </Button>
      </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    
};

export default MenuItem;
