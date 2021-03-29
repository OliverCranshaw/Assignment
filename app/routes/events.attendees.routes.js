const eventsAttendees = require('../controllers/events.attendees.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/events/:id/attendees')
        .get(eventsAttendees.retrieve)
        .post(eventsAttendees.request)
        .delete(eventsAttendees.remove);


    app.route(app.rootUrl + '/events/:id/attendees/:id')
        .post(eventsAttendees.changeStatus);
};