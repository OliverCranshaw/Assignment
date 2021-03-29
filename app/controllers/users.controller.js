const users = require('../models/users.model');
const bcrypt = require('bcrypt');

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
    console.log( '\nRequest to login to a user...' );
    const email = req.body.email
    const password = req.body.password

    if (email == null || password == null) {

        res.status( 400 )
            .send();
    } else {

        try {
            const possibleResult = await users.getFromEmail(email);

            if (possibleResult.length == 0)  {
                res.status( 400 )
                    .send( 'Error email is not registered' )
            } else {

                const correct = await bcrypt.compare(password, possibleResult[0].password)

                if (correct) {

                    const userToken = await users.setAuth(possibleResult[0].id);

                    res.status( 200 )
                        .send( {userId: possibleResult[0].id, token: userToken} );
                } else {

                    res.status( 400 )
                        .send( 'Incorrect Password' );
                }
            }


        } catch( err ) {
            res.status( 500 )
                .send( `ERROR logging in to user ${ err }` );
        }
    }



};

exports.logout = async function (req, res) {

     try {

        const authToken = req.header('X-Authorization');

        const result = await users.checkAuth(authToken);

        if (result.length == 0) {
            res.status( 401 )
                .send( 'Incorrect or no auth token' );
        } else {

            users.deleteToken(result[0].id);

            res.status( 200 )
                .send();

        }

     } catch( err ) {
                res.status( 500 )
                    .send( `ERROR logging out ${ err }` );
            }



};

exports.retrieve = async function (req, res) {


    try {

        const userid = req.params.id;

        const user = await users.getFromId(userid);

        if (user.length == 0) {
            res.status( 404 )
                .send("User not found");
        } else {

            const authToken = req.header('X-Authorization');

            if (authToken == user[0].auth_token) {
                res.status( 200 )
                    .send({firstName: user[0].first_name, lastName: user[0].last_name, email: user[0].email});
            } else {
                res.status( 200 )
                    .send({firstName: user[0].first_name, lastName: user[0].last_name});
            }


        }

    } catch( err ) {
        res.status( 500 )
        .send( `ERROR getting user details ${ err }` );
    }

};

exports.change = async function (req, res) {


    try {

        const userid = req.params.id;

        const user = await users.getFromId(userid);

        const authToken = req.header('X-Authorization');

        if (authToken != user[0].auth_token) {
            res.status( 401 )
                .send("Cannot change another users details");
        } else {

            const email = req.body.email
            const firstName = req.body.firstName
            const lastName = req.body.lastName
            const password = req.body.password
            const currentPassword = req.body.currentPassword
            var okay = false


            if (password != null) {

                if (password == "") {
                    res.status( 400 )
                        res.send("Can't set new password to empty string")
                } else {

                    const correct = await bcrypt.compare(currentPassword, user[0].password)

                    if (correct) {
                        users.updatePassword(password, userid);
                        okay = true

                    } else {
                        res.status( 403 )
                            res.send("Incorrect current password");
                    }


                }
            }

            if (email != null) {

                if(!/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/.test(email)) {

                    res.status( 400 )
                        res.send("Incorrect email syntax")

                } else {

                    const possibleUser = await users.getFromEmail(email, userid);

                    if (possibleUser.length != 0) {
                        res.status( 400 )
                            res.send("Email already in use")
                    } else {
                        users.updateEmail(email, userid);
                        okay = true;
                    }


                }
            }

            if (firstName != null) {

                if (firstName == "") {
                    res.status( 400 )
                        res.send("First name can't be empty")
                } else {
                    users.updateFirstName(firstName, userid);
                    okay = true;
                }

            }

            if (lastName != null) {

                if (lastName == "") {
                    res.status( 400 )
                        res.send("Last name can't be empty")
                } else {
                    users.updateLastName(lastName, userid);
                    okay = true;
                }

            }

            if (okay) {
                res.status( 200 )
                    res.send();
            } else {
                res.status( 400 )
                    res.send();
            }


        }

    } catch( err ) {
        res.status( 500 )
        .send( `ERROR getting user details ${ err }` );
    }
};