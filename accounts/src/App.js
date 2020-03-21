import React, { useEffect } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { history, isServer } from './store';
import { connect } from 'react-redux';
import { allRoutes } from './routes';
import NotFound from './components/404';
import BackboneModals from './containers/BackboneModals';
import { User, DASHBOARD_URL, IS_SAAS_SERVICE } from './config';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import Cookies from 'universal-cookie';
import { saveStatusPage, checkIfMasterAdminExists } from './actions/login';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

const cookies = new Cookies();
const logoutData = cookies.get('logoutData');

if (!isServer) {
    history.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

const statusPageLogin = queryString.parse(window.location.search).statusPage;
const statusPageURL = queryString.parse(window.location.search).statusPageURL;

if (logoutData && User.isLoggedIn()) {
    cookies.remove('logoutData', { domain: window.location.hostname });
    localStorage.clear();
} else if (!statusPageLogin && !logoutData && User.isLoggedIn()) {
    window.location = DASHBOARD_URL;
}

const App = ({
    masterAdmin: { exists },
    checkIfMasterAdminExists,
    saveStatusPage,
}) => {
    useEffect(() => {
        if (!IS_SAAS_SERVICE && exists === null) {
            checkIfMasterAdminExists();
        }
    }, [exists, checkIfMasterAdminExists]);

    if (statusPageLogin && statusPageURL) {
        saveStatusPage({
            statusPageLogin,
            statusPageURL,
        });
    }

    return (
        <div style={{ height: '100%' }}>
            <Router history={history}>
                <Switch>
                    {allRoutes
                        .filter(route => route.visible)
                        .map((route, index) => {
                            return (
                                <Route
                                    exact={route.exact}
                                    path={route.path}
                                    key={index}
                                    component={route.component}
                                />
                            );
                        })}
                    <Route
                        path={'/:404_path'}
                        key={'404'}
                        component={NotFound}
                    />
                    <Redirect to="/login" />
                </Switch>
            </Router>
            <BackboneModals />
        </div>
    );
};

App.displayName = 'App';

App.propTypes = {
    saveStatusPage: PropTypes.func.isRequired,
    checkIfMasterAdminExists: PropTypes.func.isRequired,
    masterAdmin: PropTypes.object,
};

function mapStateToProps(state) {
    return state.login;
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { saveStatusPage, checkIfMasterAdminExists },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
