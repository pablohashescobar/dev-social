import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentUserProfile } from "../../actions/profile";

const Dashboard = ({ getCurrentUserProfile, profile, auth }) => {
    useEffect(() => {
        getCurrentUserProfile();
        // eslint-disable-next-line
    }, []);

    return <div>DashBoard</div>;
};

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentUserProfile })(Dashboard);
