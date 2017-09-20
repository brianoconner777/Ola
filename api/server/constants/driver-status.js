import _ from 'lodash';

const DRIVER_STATUS = {
 'AVAILABLE': 'AVAILABLE',
 'ASSIGNED': 'ASSIGNED'
};

export const options = _.values(DRIVER_STATUS);

export default DRIVER_STATUS;