const db = require('../../config/db');

exports.insert = async function( email, firstName, lastName, password ) {

    console.log( `Request to insert user into the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into user (email, first_name, last_name, password) values ( ? )';
    const [ result ] = await conn.query( query, [ [email, firstName, lastName, password] ] );
    conn.release();
    return result;
};

exports.getFromEmail = async function( email ) {

    console.log( `Request to check if email is taken...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where email = ?';
    const [ result ] = await conn.query( query, [ email ]);
    conn.release();
    return result;
};
