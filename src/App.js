import { BrowserRouter as Router, Route } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import Landing from './pages/landing/landing.page';
import DashBoard from './pages/dashboard/dashboard.page';
import Login from './pages/login/login.page';
import SignUp from './pages/sign-up/sign-up.page';
import VerifyAccount from './pages/verification/verify-account.page';
import ForgottenPassword from './pages/verification/forgotten-password.page';
import Profile from './pages/profile/profile.page';
import WorkingHours from './pages/working-hours/working-hours.page';
import ChangePassword from './pages/change-password/change-password.page';
import SignUpSecondStep from './pages/sign-up/sign-up-second-step.page';
import SignUpThirdStep from './pages/sign-up/sign-up-third-step.page';
import Menu from './pages/menu/menu.page';
import Specials from './pages/specials/specials.page';
import Modifiers from './pages/modifiers/modifiers.page';
import Orders from './pages/orders/orders.page';
import ProtectedRoute from './components/protected-route';
import 'antd/dist/antd.css';
import './styles/foreign-components.scss';
import './styles/modal.scss';
import './styles/elements.scss';
import './styles/common.scss';

export default function App() {
    return (
      <Router>
          <ToastContainer
            enableMultiContainer
            containerId={"top-center"}
            position={toast.POSITION.TOP_CENTER}
          />
          <Route path="/" exact component={Landing}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/sign-up" exact component={SignUp}></Route>
          <Route path="/verify-account/:id" exact component={VerifyAccount}></Route>
          <Route path="/forgotten-password/:id" exact component={ForgottenPassword}></Route>
          <Route path="/sign-up-second-step" exact component={SignUpSecondStep}></Route>
          <Route path="/sign-up-third-step" exact component={SignUpThirdStep}></Route>
          <ProtectedRoute path="/dashboard" component={DashBoard}></ProtectedRoute>
          <ProtectedRoute path="/menu" component={Menu}></ProtectedRoute>
          <ProtectedRoute path="/specials" component={Specials}></ProtectedRoute>
          <ProtectedRoute path="/modifiers" component={Modifiers}></ProtectedRoute>
          <ProtectedRoute path="/orders" component={Orders}></ProtectedRoute>
          <ProtectedRoute path="/profile" component={Profile}></ProtectedRoute>
          <ProtectedRoute path="/working-hours" component={WorkingHours}></ProtectedRoute>
          <ProtectedRoute path="/change-password" component={ChangePassword}></ProtectedRoute>
      </Router>
    );
}