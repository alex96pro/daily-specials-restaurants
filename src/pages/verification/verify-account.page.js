import './verify-account.page.scss';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { verifyAccountAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/common/loader';
import NavBar from '../../components/nav-bar/nav-bar';

export default function VerifyAccount() {

    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loadingStatus = useSelector(state => state.authentication.loadingStatus);

    useEffect(() => {
        if(params.id){
            dispatch(verifyAccountAPI(params.id));
        }
    }, [params.id, dispatch]);
    
    return (
        <div className="verify-account">
            <NavBar loggedIn={false}/>
            {loadingStatus? <Loader/>:
                <div className="wrapper-container">
                    <div className="verify-header">Congratulations ! You are ready to go !</div>
                    <button className="button-long" onClick={() => history.push('/login')}>Log In</button>
                </div>
            }
        </div>
    );
};