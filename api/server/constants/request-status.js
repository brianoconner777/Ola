import _ from 'lodash';

const REQUEST_STATUS = {
 'WAITING': 'WAITING',
 'ONGOING': 'ONGOING',
 'COMPLETED': 'COMPLETED',
};

export const options = _.values(REQUEST_STATUS);

export default REQUEST_STATUS;