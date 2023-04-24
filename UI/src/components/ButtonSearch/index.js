import classNames from 'classnames/bind';
import styles from './ButtonSearch.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ButtonSearch({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    active = false,
    large = false,
    bar = false,
    children,
    className,
    data=[],
    onClick,
    type_,
    ...passProps
}) {
    const [display,setDisplay]=useState(false)
    const [value,setValue]=useState(children)
    let Comp = 'button';
    const _props = { onClick,...passProps };

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
        bar,
        large,
        active,
    });
    const handleClickdisplay=()=>{
        setDisplay(!display)
    }
   
    const handleClick=(e)=>{
        setDisplay(!display)
        setValue(e.target.innerText)
        onClick(e,type_)

        //onClick(e.target.innerText)
    }
    return (
        <Comp className={classes} {..._props} onClick={handleClickdisplay}>
            <input className={cx('title')} value={value}></input>
            {display&&<div className={cx('data')}>
            {data.length>0 && data.map((datas,index)=>{
                return <p key={index} onClick={handleClick} >{datas}</p>
            })}
            </div>}
        </Comp>
    );
}
ButtonSearch.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default ButtonSearch;
