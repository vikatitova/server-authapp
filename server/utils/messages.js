const moment = require('moment');

const formatMessage = (customerName, text) => {
    return {
        customerName,
        text,
        time: moment().format('h:mm a'),
    };
};

module.exports = formatMessage;
