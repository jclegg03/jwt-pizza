import React from 'react';
import { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Home from '../views/general/home';
import About from '../views/about/about';
import Register from '../views/registration/register';
import Login from '../views/registration/login';
import Logout from '../views/registration/logout';
import Menu from '../views/general/menu';
import Delivery from '../views/diner/delivery';
import FranchiseDashboard from '../views/franchise/franchiseDashboard';
import History from '../views/diner/history';
import AdminDashboard from '../views/admin/adminDashboard';
import DinerDashboard from '../views/diner/dinerDashboard';
import CreateStore from '../views/franchise/createStore';
import CreateFranchise from '../views/admin/createFranchise';
import CloseFranchise from '../views/admin/closeFranchise';
import CloseStore from '../views/franchise/closeStore';
import CloseUser from '../views/admin/closeUser';
import Payment from '../views/diner/payment';
import NotFound from '../views/general/notFound';
import Docs from '../views/about/docs';
import Breadcrumb from '../components/breadcrumb';
import { pizzaService } from '../service/service';
import { Role, User } from '../service/pizzaService';
import UsersView from '../views/admin/users';
import 'preline/preline';

declare global {
  interface Window {
    HSStaticMethods: any;
  }
}

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const user = await pizzaService.getUser();
      setUser(user);
    })();
  }, []);

  useEffect(() => {
    window.HSStaticMethods.autoInit();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  function loggedIn() {
    return !!user;
  }
  function loggedOut() {
    return !loggedIn();
  }
  function isAdmin() {
    return Role.isRole(user, Role.Admin);
  }
  function isNotAdmin() {
    return !isAdmin();
  }

  const navItems = [
    { title: 'Home', to: '/', component: <Home />, display: [] },
    { title: 'Order', to: '/menu', component: <Menu />, display: ['nav'] },
    {
      title: 'Franchise',
      to: '/franchise-dashboard',
      component: <FranchiseDashboard user={user} />,
      constraints: [isNotAdmin],
      display: ['nav', 'footer'],
    },
    { title: 'About', to: '/about', component: <About />, display: ['footer'] },
    { title: 'History', to: '/history', component: <History />, display: ['footer'] },
    { title: 'Admin', to: '/admin-dashboard', component: <AdminDashboard user={user} />, constraints: [isAdmin], display: ['nav'] },
    { title: 'Create franchise', to: '/:subPath?/create-franchise', component: <CreateFranchise />, display: [] },
    { title: 'Close franchise', to: '/:subPath?/close-franchise', component: <CloseFranchise />, display: [] },
    { title: 'Create store', to: '/:subPath?/create-store', component: <CreateStore />, display: [] },
    { title: 'Close store', to: '/:subPath?/close-store', component: <CloseStore />, display: [] },
    { title: 'Close user', to: '/:subPath?/close-user', component: <CloseUser />, display: [] },
    { title: 'Payment', to: '/payment', component: <Payment />, display: [] },
    { title: 'Delivery', to: '/delivery', component: <Delivery />, display: [] },
    { title: 'Login', to: '/:subPath?/login', component: <Login setUser={setUser} />, constraints: [loggedOut], display: ['nav'] },
    { title: 'Register', to: '/:subPath?/register', component: <Register setUser={setUser} />, constraints: [loggedOut], display: ['nav'] },
    { title: 'Logout', to: '/:subPath?/logout', component: <Logout setUser={setUser} />, constraints: [loggedIn], display: ['nav'] },
    { title: 'Docs', to: '/docs/:docType?', component: <Docs />, display: [] },
    { title: 'Opps', to: '*', component: <NotFound />, display: [] },
    { title: 'Diner', to: '/diner-dashboard', component: <DinerDashboard user={user} setUser={setUser} />, display: [] },
    { title: "Manage Users", to: '/admin-dashboard/users', component: <UsersView/>, constraints: [isAdmin], display: [] },
  ];

  return (
    <div className="bg-gray-800">
      <Header user={user} navItems={navItems} />
      <Breadcrumb location={location.pathname.replace('/', '')} />

      <main className="size-full">
        <Routes>
          {navItems.map((item) => (
            <Route key={item.title} path={item.to} element={item.component} />
          ))}
        </Routes>
      </main>

      <Footer navItems={navItems} />
    </div>
  );
}
