const db = require('../../config/db');

exports.getPath = async function( eventId ) {

    console.log( `Request to get event image path...` );
    const conn = await db.getPool().getConnection();
    const query = 'select image_filename from event where id = ?';
    const [ result ] = await conn.query( query, [ eventId ]);
    conn.release();
    return result;
};

exports.getFromId = async function( eventId ) {

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [ result ] = await conn.query( query, [ eventId ]);
    conn.release();
    return result;
};

exports.setPath = async function( imagePath, eventId ) {

    console.log( `Request to set event image path...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set image_filename = ? where id = ?';
    const [ result ] = await conn.query( query, [ imagePath, eventId ]);
    conn.release();
    return result;
};