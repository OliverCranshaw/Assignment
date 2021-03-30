const db = require('../../config/db');

exports.getEvent = async function( eventId ) {
    console.log( `Request to get event from databse...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [ rows ] = await conn.query( query, [ eventId ] );
    conn.release();
    return rows;
};

exports.getAttendees = async function( eventId ) {
    console.log( `Request to get attendees for an event...` );
    const conn = await db.getPool().getConnection();
    const query = 'select user_id as "attendeeId", name as "status", first_name as firstName, last_name as lastName, date_of_interest as dateOfInterest \
                    from event_attendees join user on user_id = user.id join attendance_status on attendance_status_id = attendance_status.id \
                    where event_id = ? and attendance_status_id = 1 order by date_of_interest';
    const [ rows ] = await conn.query( query, [ eventId ] );
    conn.release();
    return rows;
};

exports.getAttendeesAndSelf = async function( eventId, userId ) {
    console.log( `Request to get attendees for an event...` );
    const conn = await db.getPool().getConnection();
    const query = 'select user_id as "attendeeId", name as "status", first_name as firstName, last_name as lastName, date_of_interest as dateOfInterest \
                    from event_attendees join user on user_id = user.id join attendance_status on attendance_status_id = attendance_status.id \
                    where event_id = ? and (attendance_status_id = 1 or user.id = ?) order by date_of_interest';
    const [ rows ] = await conn.query( query, [ eventId, userId ] );
    conn.release();
    return rows;
};

exports.getAttendeesAll = async function( eventId ) {
    console.log( `Request to get attendees for an event...` );
    const conn = await db.getPool().getConnection();
    const query = 'select user_id as "attendeeId", name as "status", first_name as firstName, last_name as lastName, date_of_interest as dateOfInterest \
                    from event_attendees join user on user_id = user.id join attendance_status on attendance_status_id = attendance_status.id \
                    where event_id = ? order by date_of_interest';
    const [ rows ] = await conn.query( query, [ eventId ] );
    conn.release();
    return rows;
};

exports.checkAttendee = async function( eventId, userId ) {
    console.log( `Request to get attendees for an event...` );
    const conn = await db.getPool().getConnection();
    const query = 'select user_id from event_attendees where event_id = ? and user_id = ?';
    const [ rows ] = await conn.query( query, [ eventId, userId ] );
    conn.release();
    return rows;
};

exports.addAttendee = async function( eventId, userId ) {
    console.log( `Request to get attendees for an event...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_attendees (event_id, user_id, attendance_status_id) values (?, ?, ?)';
    const [ rows ] = await conn.query( query, [ eventId, userId, 2] );
    conn.release();
    return rows;
};