import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';


import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
// import Login from '../routes/Login';
import Login from './Auth/Login';

import Header from './Header/Header';
import System from '../routes/System';

import { CustomToastCloseButton } from '../components/CustomToast';
import HomePage from './HomePage/HomePage.js'

import CustomScrollbars from '../components/CustomScrollbars.js';
import SignUpEmployer from './SignUp/SignUpEmployer.js'
import SignUpCandidate from './SignUp/SignUpCandidate.js';
import Recruitment from './Employer/Recruitment.js'
import Candidate from './Candidate/Candidate.js';
import RecruitmentDetail from './Candidate/RecruitmentDetail.js';
import Companies from './HomePage/Companies.js';
import CompanyDetail from './HomePage/CompanyDetail.js';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                        <CustomScrollbars style = {{height:'100vh',width:'100%'}}>
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                <Route path={path.HOMEPAGE} component={HomePage}/>
                                <Route path={path.SIGNUPEMPLOYER} component={SignUpEmployer} />
                                <Route path={path.SIGNUPCANDIDATE} component={SignUpCandidate} />

                                <Route path={path.RECRUITMENT} component={Recruitment} />
                                <Route path={path.CANDIDATE} component={Candidate} />

                                <Route path={path.RECRUITMENT_DETAIL} component={RecruitmentDetail} />

                                <Route path={path.COMPANIES} component={Companies} />
                                
                                <Route path={path.COMPANY_DETAIL} component={CompanyDetail} />

                            </Switch>
                        </CustomScrollbars>
                        </div>

                        
                        <ToastContainer
                            position='top-right'
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />


                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        userInfo : state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);