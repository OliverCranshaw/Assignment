const eventsImages = require('../models/events.images.model');
const users = require("../models/users.model");

exports.retrieve = async function (req, res) {

    try {

        const eventId = req.params.id;
        const possibleImage = await eventsImages.getPath(eventId);

        if (possibleImage.length === 0) {
            res.status( 404 )
            res.send("No user with this id");

        } else if (possibleImage[0].image_filename == null) {
            res.status( 404 )
            res.send("No image for this user");

        } else {
            const filename = possibleImage[0].image_filename;

            if (filename.endsWith("png")) {

                res.header("Content-Type").set('image/png')
                res.status(200)
                res.sendFile(filename, { root: "storage/images"});

            } else if (filename.endsWith("jpg")) {

                res.header("Content-Type").set('image/jpeg')
                res.status(200)
                res.sendFile(filename, { root: "storage/images"});

            } else if (filename.endsWith(".gif")) {

                res.header("Content-Type").set('image/gif')
                res.status(200)
                res.sendFile(filename, { root: "storage/images"});
            }
        }


    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting user image ${ err }` );
    }

};

exports.set = async function (req, res) {
    try {

        const eventId = req.params.id;

        const event = await eventsImages.getFromId(eventId);

        const authToken = req.header('X-Authorization');

        if (event.length === 0) {
            res.status( 404 )
                .send("Event not found");

        } else if (authToken == null) {
            res.status(401)
                .send("No auth token");

        } else {
            const user = await users.checkAuth(authToken);

            if (user[0].id !== event[0].organizer_id) {
                res.status(403)
                    .send("Cannot change image of another users");


            } else {
                const imageType = req.header("Content-Type");

                const dateString = Date.now();

                let filename = 'event_' + dateString;

                const savePath = 'storage/images/';


                if (event[0].image_filename == null) {

                    res.status(201);

                } else {

                    res.status(200);
                }

                if (imageType == 'image/jpeg') {
                    filename += '.jpg';

                    await eventsImages.setPath(filename, eventId);
                    await fs.writeFile(savePath + filename, req.body);
                } else if (imageType == 'image/png') {
                    filename += '.png';

                    await eventsImages.setPath(filename, eventId);
                    await fs.writeFile(savePath + filename, req.body);

                } else if (imageType == 'image/gif') {
                    filename += '.gif'

                    await eventsImages.setPath(filename, eventId);
                    await fs.writeFile(savePath + filename, req.body);
                } else {
                    res.status(400)
                }


                res.send();

            }
        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR changing events image ${ err }` );
    }
};

