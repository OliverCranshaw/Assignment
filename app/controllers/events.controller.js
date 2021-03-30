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



        if (sortBy == null || 'DATE_DESC') {
            sortBy = 'date DESC';
        } else if (sortBy == 'ALPHABETICAL_ASC') {
            sortBy = 'title ASC';
        } else if (sortBy == 'ALPHABETICAL_DESC') {
            sortBy = 'title DESC';
        } else if (sortBy == 'DATE_ASC') {
            sortBy = 'date ASC';
        } else if (sortBy == 'CAPACITY_ASC') {
            sortBy = 'capacity ASC';
        } else if (sortBy == 'CAPACITY_DESC') {
            sortBy = 'capacity DESC';
        }

        if (startIndex == null) {
            startIndex = 0;
        }

        if (search != null) {

        }
        if (catId != null) {

        }

        if (organizerId != null) {

        }


        const result = await events.getQueriedEvents(sortBy);

        res.status( 200 )
            .send( result.slice(startIndex, count + 1) );


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