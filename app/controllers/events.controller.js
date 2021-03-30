const events = require('../models/events.model');
const users = require('../models/users.model');

exports.view = async function (req, res) {
    console.log( '\nRequest to list users...' );
    try {

        let startIndex = req.query.startIndex;
        const count = req.query.count;
        let search = req.query.q;
        let catId = req.query.categoryIds;
        let organizerId = req.query.organizerId;
        let sortBy = req.query.sortBy;
        let result = [];


        if (sortBy == null || sortBy == 'DATE_DESC') {
            sortBy = 'date DESC';
        } else if (sortBy === 'ALPHABETICAL_ASC') {
            sortBy = 'title ASC';
        } else if (sortBy === 'ALPHABETICAL_DESC') {
            sortBy = 'title DESC';
        } else if (sortBy === 'DATE_ASC') {
            sortBy = 'date ASC';
        } else if (sortBy === 'CAPACITY_ASC') {
            sortBy = 'capacity ASC';
        } else if (sortBy === 'CAPACITY_DESC') {
            sortBy = 'capacity DESC';
        }

        if (startIndex == null) {
            startIndex = 0;
        }

        let valid = true;

        if (catId != null) {

            if (Array.isArray(catId)) {

                for (let i = 0; i < catId.length; i++) {
                    result = await events.checkCat(catId[i]);
                    if (result.length === 0) {
                        valid = false;
                    }
                }
            } else {
                result = await events.checkCat(catId);
                if (result.length === 0) {
                    valid = false;
                }
            }
        }

        if (!valid) {
            res.status( 400 )
                res.send("Category ID does not exist")
        } else {

            if (search != null && catId != null && organizerId != null) {
                result = await events.getQueryCatOrg(sortBy, search, catId, organizerId);
                for (let i = 0; i < result.length; i++) {
                    let eventCats = await events.getEventCats(result[i].eventId);
                    result[i].categories = eventCats[0].eventCats;
                }

            } else if (catId != null && organizerId != null) {
                result = await events.getCatOrg(sortBy, search);
                for (let i = 0; i < result.length; i++) {
                    let eventCats = await events.getEventCats(result[i].eventId);
                    result[i].categories = eventCats[0].eventCats;
                }

            } else if (search != null && organizerId != null) {
                result = await events.getQueryOrg(sortBy, search, organizerId);
            } else if (search != null && catId != null) {
                result = await events.getQueryCat(sortBy, search, catId);
                for (let i = 0; i < result.length; i++) {
                    let eventCats = await events.getEventCats(result[i].eventId);
                    result[i].categories = eventCats[0].eventCats;
                }

            } else if (organizerId != null) {
                result = await events.getOrdId(sortBy, organizerId);
            } else if (search != null) {
                result = await events.getQuery(sortBy, search);
            } else if (catId != null) {
                result = await events.getCatId(sortBy, catId);
                for (let i = 0; i < result.length; i++) {
                    let eventCats = await events.getEventCats(result[i].eventId);
                    result[i].categories = eventCats[0].eventCats;
                }

            } else {
                result = await events.getAllEvents(sortBy);
            }

            res.status(200)

            if (count == null) {
                res.send(result.slice(startIndex));
            } else {
                res.send(result.slice(startIndex, Number(count) + 1));
            }
        }



    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting users ${ err }` );
    }
};

exports.add = async function (req, res) {

    console.log('\nRequest to add event...');
    try {
        const authToken = req.header('X-Authorization');

        if (authToken == null) {
            res.status(401)
                .send("No auth token");
        } else {
            const user = await users.checkAuth(authToken);
            if (user.length == 0) {
                res.status(401)
                    .send("Incorrect auth token");
            } else {
                const userId = user[0].id;
                const title = req.body.title;
                const description = req.body.description;
                const catList = req.body.categoryIds;
                const date = req.body.date;
                const dateObject = new Date(date);
                let isOnline = req.body.isOnline;
                const url = req.body.url;
                const venue = req.body.venue;
                const capacity = req.body.capacity;
                let requiresAttendanceControl = req.body.requiresAttendanceControl;
                let fee = req.body.fee;

                if (isOnline == null) {
                    isOnline = 0;
                }
                if (requiresAttendanceControl == null) {
                    requiresAttendanceControl = 0;
                }
                if (fee == null) {
                    fee = 0.00;
                }
                if (title == null || title === "" || description == null || catList == null || date == null) {
                    res.status(400)
                        .send("Bad request body");
                } else if (capacity != null && capacity < 1) {
                    res.status(400)
                        .send("Bad request body");
                } else {
                    let valid = true;
                    const catList = req.body.categoryIds;
                    for (let i = 0; i < catList.length; i++) {
                        let result = await events.checkCat(catList[i]);
                        if (result.length === 0) {
                            valid = false;
                        }
                    }

                    if (!valid) {
                        res.status(400)
                            .send("Category ID does not exist");
                    } else {
                        let now = new Date();
                        if (dateObject < now) {

                            res.status(400)
                                .send("Date is not in the future");

                        } else {

                            const eventCheck = await events.checkEvent(title, date, userId);

                            if (eventCheck.length !== 0) {
                                res.status( 400 )
                                    .send("Event already created");

                            } else {

                                let result = await events.insert(title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, userId);

                                for (let i = 0; i < catList.length; i++) {

                                    await events.insertCat(result.insertId, catList[i]);
                                }

                                res.status(201)
                                    .send({eventId: result.insertId});
                            }

                        }
                    }

                }
            }
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.retrieve = async function (req, res) {

    try {

        const eventId = req.params.id;

        const event = await events.getEvent(eventId);

        if (event.length == 0) {
            res.status( 404 )
                .send("No event found");
        } else {
            const eventObj = event[0];
            res.status( 200 )
                res.send(eventObj)
        }

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.change = async function (req, res) {
    return null;
};

exports.delete = async function (req, res) {
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
            } else if (user[0].id !== event[0].organizerId) {
                res.status( 403 )
                    .send("You are not the organizer of this event")
            } else {

                await events.deleteAttendees(eventId);
                await events.deleteEventCat(eventId);
                await events.deleteEvent(eventId);

                res.status( 200 )
                    .send()

            }

        }
    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};

exports.retrieveCat = async function (req, res) {

    try {

        const catList = await events.retrieveCats();

        res.status( 200 )
            .send(catList);

    } catch (err) {
        res.status(500)
            .send(`ERROR inserting event ${err}`);
    }
};
