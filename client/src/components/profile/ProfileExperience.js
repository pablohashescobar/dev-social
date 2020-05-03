import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
    experience: { company, title, location, curren, to, from, description },
}) => {
    return (
        <div>
            <h3 className='text-dark'>{company}</h3>
            <p>
                <Moment format='YYYY/MM/DD'>{from}</Moment>
            </p>{' '}
            - {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
            <p>
                <strong>Position: </strong>
                {title}
            </p>
            <p>
                <strong>Title: </strong>
                {description}
            </p>
        </div>
    );
};

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
