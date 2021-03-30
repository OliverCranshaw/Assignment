const eventsAttendees = require('../models/events.attendees.model');

exports.retrieve = async function (req, res) {

    try {

        const eventId = req.params.id;

        const event = await eventsAttendees.getEvent(eventId);

        if (event.length == 0) {
            res.status( 404 )
                .send("No event found");
        } else {

            const attendees = await eventsAttendees.getAttendees(eventId);

            res.status( 200 )
                .send(attendees);
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.request = async function (req, res) {
    return null;
};

exports.remove = async function (req, res) {
    return null;
};

exports.changeStatus = async function (req, res) {
    return null;
};