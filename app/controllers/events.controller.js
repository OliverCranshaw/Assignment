const events = require('../models/events.model');

exports.view = async function (req, res) {
    console.log( '\nRequest to list users...' );
    try {
        const result = await events.getAll();
        res.status( 200 )
            .send( result );


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