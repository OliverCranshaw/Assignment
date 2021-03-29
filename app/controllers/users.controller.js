const users = require('../models/users.model');

exports.register = async function (req, res) {
    console.log( '\nRequest to register a user...' );
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password

    if (email == null || firstName == null || lastName == null || password == null || firstName == "" || lastName == "" || password == "") {

        res.status( 400 )
            .send();
    } else if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/.test(email)) {
        res.status( 400 )
            .send();

    } else {

        try {
            const possibleResult = await users.getFromEmail(email);

            if (possibleResult.length != 0)  {
                res.status( 400 )
                    .send( 'Error email already in use' )
            } else {

                const result = await users.insert(email, firstName, lastName, password);

                res.status( 201 )
                    .send( {userId: result.insertId} );
            }


        } catch( err ) {
            res.status( 500 )
                .send( `ERROR inserting users ${ err }` );
        }
    }
};

exports.login = async function (req, res) {
    return null;
};

exports.logout = async function (req, res) {
    return null;
};

exports.retrieve = async function (req, res) {
    return null;
};

exports.change = async function (req, res) {
    return null;
};