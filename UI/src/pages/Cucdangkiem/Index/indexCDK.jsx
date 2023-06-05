import { Outlet } from "react-router-dom";
import styles from "./indexCDK.module.scss";
import classNames from 'classnames/bind';
import { Typography } from "@mui/material";
import url from '../../../assets/images/success.gif'
const cx = classNames.bind(styles);

function IndexCDK() {
    return (<div>
        <img src = {url} alt="gif" style={{
            width: 500,
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 50,
            marginBottom: 50
        }}/>
        <Typography variant="h5" color="primary" sx={{
            textAlign: "center"
        }}>
            Chúc mừng bạn đã đăng nhập thành công!
        </Typography>
    </div>
    );
}

export default IndexCDK;