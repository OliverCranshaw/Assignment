const eventsAttendees = require('../models/events.attendees.model');
const users = require("../models/users.model");

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
                } else {
                    attendees = await eventsAttendees.getAttendees(eventId);
                    res.status(200)
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
        const event = await eventsAttendees.getEvent(eventId);
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

    try {
        const eventId = req.params.id;
        const event = await eventsAttendees.getEvent(eventId);
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

                if (dateObject < now) {
                    res.status( 403 )
                        .send("Can't delete from event in the past");
                } else if (possibleAttendee.length == 0) {
                    res.status( 403 )
                        .send("Can't delete from event you haven't signed up for");
                } else if (possibleAttendee.attendance_status_id == 3) {
                    res.status( 403 )
                        .send("Can't delete from event you have been rejected for");
                } else {
                    await eventsAttendees.deleteAttendee(eventId, userId);
                    res.status( 200 )
                        .send();
                }



            }
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.changeStatus = async function (req, res) {

    try {
        const eventId = req.params.event_id;
        const userId = req.params.user_id
        const event = await eventsAttendees.getEvent(eventId);
        const authToken = req.header('X-Authorization');

        const status = req.body.status;

        if (event.length == 0) {
            res.status(404)
                .send("No event found");
        } else if (authToken == null) {
            res.status(401)
                .send("No auth token")
        } else if (status == null || !(status === "accepted" || status === "pending" || status === "rejected")) {
            res.status(400)
                .send("Wrong status")
        } else {

            const user = await users.checkAuth(authToken);

            if (user.length == 0) {
                res.status(401)
                    .send("Incorrect auth token");

            } else if (userId != user[0].id) {
                res.status(401)
                    .send("Incorrect auth token");

            } else if (userId != event[0].organizer_id) {
                res.status(403)
                    .send("You are not the organizer of this event");
            } else {

                const possibleAttendee = await eventsAttendees.checkAttendee(eventId, userId);

                console.log(event);

                if (possibleAttendee.length == 0) {
                    res.status(404)
                        .send("Can't update user who is not attending");
                } else {
                    let intStatus;
                    if (status == "accepted") {
                        intStatus = 1;
                    } else if (status == "pending") {
                        intStatus = 2;
                    } else if (status == "rejected") {
                    intStatus = 3;
                    }

                    await eventsAttendees.updateAttendee(intStatus, eventId, userId);
                    res.status( 200 )
                        .send();
                }



            }
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }

};