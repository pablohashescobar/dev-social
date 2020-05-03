import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUserProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import Experience from './Experience';
import Education from './Education';
import DashBoardActions from './DashBoardActions';

const Dashboard = ({
    getCurrentUserProfile,
    profile: { profile, loading },
    auth: { user },
}) => {
    useEffect(() => {
        getCurrentUserProfile();
        // eslint-disable-next-line
    }, []);

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className='large text-primary'>DashBoard</h1>
            <p className='lead'>
                <i className='fas fa-user'></i>Welcome {user && user.name}
            </p>
            {profile !== null ? (
                <Fragment>
                    <DashBoardActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                </Fragment>
            ) : (
                <Fragment>
                    <p>You have not yet setup a profile</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>
                        Create Profile
                    </Link>
                </Fragment>
            )}
        </Fragment>
    );
};

Dashboard.propTypes = {
    profile: PropTypes.object,
    getCurrentUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentUserProfile })(Dashboard);
