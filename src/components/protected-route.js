import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function ProtectedRoute(props) {

    const conditionalRendering = () => {
        return localStorage.getItem('ACCESS_TOKEN_RESTAURANT') ? <props.component/> : <Redirect to="/login"/> 
    };

    return (
        <Route path={props.path} exact component={conditionalRendering}></Route>
    );
}