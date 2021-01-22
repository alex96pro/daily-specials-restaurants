import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/landing/landing.page';
import Login from './pages/login/login.page';
import SignUp from './pages/sign-up/sign-up.page';
import VerifyAccount from './pages/verification/verify-account.page';
import ForgottenPassword from './pages/verification/forgotten-password.page';
import Profile from './pages/profile/profile.page';
import Map from './pages/map/map.page';
import './App.scss';

export default function App() {
    return (
      <Router>
          <Route path="/" exact component={Landing}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/sign-up" exact component={SignUp}></Route>
          <Route path="/profile" exact component={Profile}></Route>
          <Route path="/verify-account/:id" exact component={VerifyAccount}></Route>
          <Route path="/forgotten-password/:id" exact component={ForgottenPassword}></Route>
          <Route path="/map" exact component={Map}></Route>
      </Router>
    );
}