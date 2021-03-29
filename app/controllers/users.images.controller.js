const usersImages = require('../models/users.images.model');
const fs = require('fs').promises;
const date = require('date-and-time');

exports.retrieve = async function (req, res) {


    try {

        const userid = req.params.id;

        const possibleImage = await usersImages.getPath(userid);


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

        const userid = req.params.id;

        const user = await usersImages.getFromId(userid);

        const authToken = req.header('X-Authorization');

        if (user.length === 0) {
            res.status( 404 )
                .send("User not found");

        } else if (authToken == null) {
            res.status(401)
                .send("No auth token");

        } else if (authToken !== user[0].auth_token) {
            res.status(403)
                .send("Cannot change image of another users");

        } else {

            // const imageType = req.header("Content-Type");
            //
            // const now = new Date();
            // const dateString = date.format(now, 'YYYY-MM-DD_HH-mm-ss');
            //
            // let filename = 'user_' + dateString;
            //
            // const savePath = 'storage/images/'
            //
            //
            // if (user[0].image_filename == null) {
            //
            //     res.status( 201 )
            //
            // } else {
            //
            //     res.status( 200 )
            // }
            //
            // if (imageType == 'image/jpeg') {
            //     filename += '.jpg';
            // } else if (imageType == 'image/png') {
            //     filename += '.png';
            // } else if (imageType == 'image/gif') {
            //     filename += '.gif'
            // }
            //
            // await fs.writeFile(savePath + filename, req.body);
            //
            // res.send();


        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR changing users image ${ err }` );
    }
};

exports.delete = async function (req, res) {
    return null;
};
