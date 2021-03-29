const db = require('../../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

exports.insert = async function( email, firstName, lastName, password ) {

    const passwordHash = await bcrypt.hash(password, 10)

    console.log( `Request to insert user into the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into user (email, first_name, last_name, password) values ( ? )';
    const [ result ] = await conn.query( query, [ [email, firstName, lastName, passwordHash] ] );
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

exports.setAuth = async function( userid ) {

    const token = await crypto.randomBytes(32).toString('base64');

    console.log( `Request to set auth token...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set auth_token = ? where id = ?';
    const [ result ] = await conn.query( query, [ token, userid ]);
    conn.release();
    return token;
};

exports.checkAuth = async function( token ) {

    console.log( `Request to check auth token...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where auth_token = ?';
    const [ result ] = await conn.query( query, [ token ]);
    conn.release();
    return result;

}

exports.deleteToken = async function( userid ) {

    console.log( `Request to delete auth token...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set auth_token = ? where id = ?';
    const [ result ] = await conn.query( query, [ null, userid ]);
    conn.release();
    return result;
}

exports.getFromId = async function( userid ) {

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [ result ] = await conn.query( query, [ userid ]);
    conn.release();
    return result;
};

exports.updateEmail = async function( email, userid ) {

    console.log(email);
    console.log(userid)

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set email = ? where id = ?';
    const [ result ] = await conn.query( query, [ email, userid ]);
    conn.release();
    return result;
};

exports.updateFirstName = async function( firstName, userid ) {

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set first_name = ? where id = ?';
    const [ result ] = await conn.query( query, [ firstName, userid ]);
    conn.release();
    return result;
};

exports.updateLastName = async function( lastName, userid ) {

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set last_name = ? where id = ?';
    const [ result ] = await conn.query( query, [ lastName, userid ]);
    conn.release();
    return result;
};

exports.updatePassword = async function( password, userid ) {

    const passwordHash = await bcrypt.hash(password, 10)

    console.log( `Request to get user details from id...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set password = ? where id = ?';
    const [ result ] = await conn.query( query, [ passwordHash, userid ]);
    conn.release();
    return result;
};



