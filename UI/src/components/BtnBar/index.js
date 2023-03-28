import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function BtnBar({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    large = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}) {



    let Comp = 'button';
    const _props = { onClick, ...passProps };


    if (disabled) {
        Object.keys(_props).forEach((key) => {
            if (key.startsWith('on') && typeof _props[key] === 'function') {
                delete _props[key];
            }
        });
    }
    if (to) {
        _props.to = to;
        Comp = Link;
    } else if (href) {
        _props.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
        small,
        text,
        large,
    });
    return (
        <Comp className={classes} {..._props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}
BtnBar.propTypes={
    to : PropTypes.string,
    href : PropTypes.string,
    primary : PropTypes.bool,
    outline : PropTypes.bool,
    text : PropTypes.bool,
    rounded : PropTypes.bool,
    disabled : PropTypes.bool,
    small : PropTypes.bool,
    large : PropTypes.bool,
    children : PropTypes.node.isRequired,
    className : PropTypes.string,
    leftIcon : PropTypes.node,
    rightIcon : PropTypes.node,
    onClick : PropTypes.func,

}

export default BtnBar;
