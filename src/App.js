import { BrowserRouter as Router, Route } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import Landing from './pages/landing/landing.page';
import Login from './pages/login/login.page';
import SignUp from './pages/sign-up/sign-up.page';
import VerifyAccount from './pages/verification/verify-account.page';
import ForgottenPassword from './pages/verification/forgotten-password.page';
import Profile from './pages/profile/profile.page';
import PickLocation from './pages/pick-location/pick-location.page';
import Menu from './pages/menu/menu.page';
import Specials from './pages/specials/specials.page';
import './styles/common.scss';
import './styles/elements.scss';

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
          <Route path="/profile" exact component={Profile}></Route>
          <Route path="/verify-account/:id" exact component={VerifyAccount}></Route>
          <Route path="/forgotten-password/:id" exact component={ForgottenPassword}></Route>
          <Route path="/pick-location" exact component={PickLocation}></Route>
          <Route path="/menu" exact component={Menu}></Route>
          <Route path="/specials" exact component={Specials}></Route>
      </Router>
    );
}