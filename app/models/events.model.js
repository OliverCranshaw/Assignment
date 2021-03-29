const db = require('../../config/db');

exports.getAll = async function( ) {
    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event order by date';
    const [rows] = await conn.query(query);
    conn.release();
    return rows;

};

exports.insert = async function( username ) {
    console.log( `Request to insert ${username} into the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into lab2_users (username) values ( ? )';
    const [ result ] = await conn.query( query, [ username ] );
    conn.release();
    return result;
};