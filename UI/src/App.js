import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './layouts/Layout';
import User from './layouts/User/user';
import Error from './pages/404/error';
import About from './pages/about/about';
import ChangeInformation from './pages/Cucdangkiem/changeInformation/changeInformation';
import Cucdangkiem from './pages/Cucdangkiem/cucdangkiem';
import RegisterCenter from './pages/Cucdangkiem/registerCenter/registerCenter';
import StatisticCDK from './pages/Cucdangkiem/Statistic/statisticCDK';
import Upload from './pages/Cucdangkiem/upload/upload';
import Index from './pages/Index';
import Login from './pages/login/login';
import Lookup from './pages/Ttdk/lookup/lookup';
import NewRegistry from './pages/Ttdk/newRegistry/newRegistry';
import StatisticTTDK from './pages/Ttdk/statistic/statisticTTDK';
import Ttdk from './pages/Ttdk/ttdk';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="cucdangkiem" element={<User />}>
                {/* Use user like a navbar */}
                <Route path=":user" element={<Cucdangkiem />}>
                    <Route index element={<Index />} />
                    <Route path="changeInformation" element={<ChangeInformation />} />
                    <Route path="registerCenter" element={<RegisterCenter />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="statistic" element={<StatisticCDK />} />
                </Route>
            </Route>
            <Route path="trungTamDangKiem" element={<User />}>
                {/* Use user like a navbar */}
                <Route path=":user" element={<Ttdk />}>
                    <Route index element={<Index />} />
                    <Route path="newRegistry" element={<NewRegistry />} />
                    <Route path="lookup" element={<Lookup />} />
                    <Route path="statistic" element={<StatisticTTDK />} />
                </Route>
            </Route>
            <Route path="*" element={<Error />} />
        </Route>,
    ),
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
