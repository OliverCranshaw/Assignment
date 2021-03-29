const usersImages = require('../models/users.images.model');
const fs = require('fs').promises;
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

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


            const filename = 'test1.jpg';

            const savePath = 'storage/images/';

            await fs.writeFile(savePath + filename, req.body);

            if (user[0].image_path == null) {

                await usersImages.setPath(filename, userid);
                res.status( 201 )
                    res.send("Added image to profile");
            } else {
                res.status( 200 )
                    res.send("Updated image on profile");
            }


        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR changing users image ${ err }` );
    }
};

exports.delete = async function (req, res) {
    return null;
};
