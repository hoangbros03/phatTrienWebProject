import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import Header from '../../components/HeaderBar/HeaderBar.jsx';
import * as API from '~/services/Auth';
import store from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../../auth/Auth';
import { useEffect, useState } from 'react';
import HeaderBar from '../../components/HeaderBar/HeaderBar.jsx';

import { Grid, Stack, Typography, Button, Container, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CarGif from '../../assets/images/car.gif';

const cx = classNames.bind(styles);
function Index() {
    return (
        <div className='styles.container'>
            <HeaderBar />
            <Grid container>
                <Grid xs={12} md={5}>
                    <Stack mt={15} ml={20} direction="column" spacing={4}>
                        <Typography color="secondary">
                            CỤC ĐĂNG KIỂM VIỆT NAM
                        </Typography>

                        <Typography variant="h2" color="primary">
                            Uy tín, chất lượng, chuyên nghiệp và hiện đại!
                        </Typography>

                        <Typography variant='body1'>
                            Đảm bảo dịch vụ nhanh chóng, chu đáo và đảm bảo quy chuẩn giao thông
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button size="large" variant="contained" href="/login" sx={{
                                width: 200
                            }}
                            >Đăng nhập
                            </Button>

                            <Button size="large" variant="outlined" startIcon={<InfoIcon />} href="/about" sx={{
                                width: 200
                            }}
                            >Xem thông tin
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid xs={12} md={7}>
                    <Box sx={{
                        width: 150,
                        height: 150,
                    }}>
                        <img style={{
                            width: 500,
                            marginTop: 70,
                            marginLeft: 200
                        }} src={CarGif} alt="gif"></img>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default Index;
