import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './layouts/Layout';
import User from './layouts/User/user';
import Error from './pages/404/error';
import About from './pages/about/about';
import Contact from './pages/contact/contact'
import ChangeInformation from './pages/Cucdangkiem/changeInformation/changeInformation';
import Cucdangkiem from './pages/Cucdangkiem/cucdangkiem';
import RegisterCenter from './pages/Cucdangkiem/registerCenter/registerCenter';
import StatisticCDK from './pages/Cucdangkiem/Statistic/statisticCDK';
import StatisticTest from './pages/Cucdangkiem/StatisticTest/statisticTest';
import Predict from './pages/Cucdangkiem/StatisticTest/predict';
import CarList from './pages/Cucdangkiem/Carlist/carlist';
import Index from './pages/Index';
import Login from './pages/login/login';
import NewRegistry from './pages/Ttdk/newRegistry/newRegistry';
import ChangePassword from './pages/Ttdk/ChangePassword/ChangePassword';
import NewRegistryCar from './pages/Ttdk/newRegistryCar/newRegistryCar';
import Ttdk from './pages/Ttdk/ttdk';
import IndexCDK from './pages/Cucdangkiem/Index/indexCDK';
import SearchCar from './layouts/searchCar/searchCar';
import Indexttdk from './pages/Ttdk/Index/indexttdk';
import Upload_ from './pages/Cucdangkiem/upload/upload';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from './theme/index';



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="cucdangkiem" element={<User />}>
                {/* Use user like a navbar display logo and username  */}
                <Route path=":user" element={<Cucdangkiem />}>
                    <Route index element={<IndexCDK />} />
                    <Route path="changeInformation" element={<ChangeInformation />} />
                    <Route path="registerCenter" element={<RegisterCenter />} />
                    <Route path="searchcar" element={<SearchCar />} />
                    <Route path="upload" element={<Upload_ />} />
                    <Route path="statistic" element={<StatisticCDK />} />
                    <Route path="carlist" element={<CarList />} />
                    <Route path="statistictest" element={<StatisticTest />} />
                    <Route path="predict" element={<Predict />} />
                </Route>
            </Route>
            <Route path="trungTamDangKiem" element={<User />}>
                {/* Use user like a navbar display logo and username */}
                <Route path=":user" element={<Ttdk />}>
                    <Route index element={<Indexttdk />} />
                    <Route path="newRegistry" element={<NewRegistry />} />
                    <Route path="newRegistryCar" element={<NewRegistryCar />} />
                    <Route path="lookup" element={<SearchCar />} />
                    <Route path="carlist" element={<CarList />} />
                    <Route path="statistic" element={<StatisticTest />} />
                    <Route path="predict" element={<Predict />} />
                    <Route path="carlist" element={<CarList/>} />
                    <Route path="changepassword" element={<ChangePassword/>} />
                </Route>
            </Route>
            <Route path="*" element={<Error />} />
        </Route>,
    ),
);

function App() {
    const theme = createTheme();
    return ( <ThemeProvider theme = {theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
    )
}

export default App;
