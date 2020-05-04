import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Register from '../auth/Login';
import Login from '../auth/Login';
import Alert from '../layout/Alert';

//Private Route
import PrivateRoute from '../routing/PrivateRoute';
//Profile
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-form/CreateProfile';
import EditProfile from '../profile-form/EditProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';

//Post
import Posts from '../posts/Posts';
import Post from '../post/Post';

//Not Found
import NotFound from '../layout/NotFound';

const Routes = () => {
    return (
        <div>
            <section className='container'>
                <Alert />
                <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/profiles' component={Profiles} />
                    <Route exact path='/profile/:id' component={Profile} />
                    <PrivateRoute
                        exact
                        path='/dashboard'
                        component={Dashboard}
                    />{' '}
                    <PrivateRoute
                        exact
                        path='/create-profile'
                        component={CreateProfile}
                    />
                    <PrivateRoute
                        exact
                        path='/edit-profile'
                        component={EditProfile}
                    />{' '}
                    <PrivateRoute
                        exact
                        path='/add-experience'
                        component={AddExperience}
                    />{' '}
                    <PrivateRoute
                        exact
                        path='/add-education'
                        component={AddEducation}
                    />
                    <PrivateRoute exact path='/posts' component={Posts} />
                    <PrivateRoute exact path='/posts/:id' component={Post} />
                    <Route component={NotFound} />
                </Switch>
            </section>
        </div>
    );
};

export default Routes;
