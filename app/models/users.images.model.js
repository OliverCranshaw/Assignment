const db = require('../../config/db');

exports.getPath = async function( userid ) {

    console.log( `Request to get image path...` );
    const conn = await db.getPool().getConnection();
    const query = 'select image_filename from user where id = ?';
    const [ result ] = await conn.query( query, [ userid ]);
    conn.release();
    return result;
};

exports.getFromId = async function( userid ) {

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [ result ] = await conn.query( query, [ userid ]);
    conn.release();
    return result;
};

exports.setPath = async function( imagePath, userid ) {

    console.log( `Request to update user image path...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set image_filename = ? where id = ?';
    const [ result ] = await conn.query( query, [ imagePath, userid ]);
    conn.release();
    return result;
};
