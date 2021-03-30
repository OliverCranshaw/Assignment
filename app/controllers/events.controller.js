const events = require('../models/events.model');

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

            for (let i = 0; i < catId.length; i++) {
                result = await events.checkCat(catId[i]);
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
        console.log( '\nRequest to add event...' );
        try {
            const result = await events.insert(req);
            res.status( 201 )
                .send( result );


        } catch( err ) {
            res.status( 500 )
                .send( `ERROR getting users ${ err }` );
        }
};

exports.retrieve = async function (req, res) {
    return null;
};

exports.change = async function (req, res) {
    return null;
};

exports.delete = async function (req, res) {
    return null;
};

exports.retrieveCat = async function (req, res) {
    return null;
};