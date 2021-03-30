const eventsAttendees = require('../models/events.attendees.model');
const users = require("../models/users.model");
const events = require("../models/events.attendees.model");

exports.retrieve = async function (req, res) {

    try {

        const eventId = req.params.id;

        const event = await eventsAttendees.getEvent(eventId);

        if (event.length == 0) {
            res.status( 404 )
                .send("No event found");
        } else {
            let attendees = [];
            const authToken = req.header('X-Authorization');

            if (authToken != null) {

                const user = await users.checkAuth(authToken);

                if (user.length != 0) {

                    const userId = user[0].id;

                    if (userId == event[0].organizer_id) {
                        attendees = await eventsAttendees.getAttendeesAll(eventId);
                    } else {
                        attendees = await eventsAttendees.getAttendeesAndSelf(eventId, userId);
                    }
                    res.status( 200 )
                        .send(attendees);
                }
            } else {
                attendees = await eventsAttendees.getAttendees(eventId);
                res.status( 200 )
                    .send(attendees);
            }


        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.request = async function (req, res) {

    try {

        const eventId = req.params.id;
        const event = await events.getEvent(eventId);
        const authToken = req.header('X-Authorization');

        if (event.length == 0) {
            res.status(404)
                .send("No event found");
        } else if (authToken == null) {
            res.status( 401 )
                .send("No auth token")
        } else {

            const user = await users.checkAuth(authToken);

            if (user.length == 0) {
                res.status(401)
                    .send("Incorrect auth token");
            } else {
                const userId = user[0].id;

                const dateObject = new Date(event[0].date);
                const now = new Date();
                const possibleAttendee = await eventsAttendees.checkAttendee(eventId, userId);

                if (possibleAttendee.length != 0) {
                    res.status( 403 )
                        .send("Already signed up for this event")
                } else if (dateObject < now) {
                    res.status( 403 )
                        .send("Can't sign up for event in the past")
                } else {
                    await eventsAttendees.addAttendee(eventId, userId);
                    res.status( 201 )
                        .send()
                }

            }
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.remove = async function (req, res) {
    return null;
};

exports.changeStatus = async function (req, res) {
    return null;
};