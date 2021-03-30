const db = require('../../config/db');

exports.getQueriedEvents = async function(sortBy) {

    console.log(sortBy);

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select EC.event_id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(*) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id join attendance_status ST \
        where ST.name = "accepted" group by E.id order by ' + sortBy

    const [rows] = await conn.query(query);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getEventFromCat = async function(catList) {
    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select event_id from event_category where category_id in ?'
    const [rows] = await conn.query(query, [[catList]]);
    conn.release();
    return rows;

};

exports.getEventFromSearch = async function(search) {
    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select id from event where title like ? or description like ?'
    const [rows] = await conn.query(query, [search, search]);
    conn.release();
    return rows;

};

exports.getEventFromOrg = async function(OrgId) {
    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select id from event where organizer_id = ?'
    const [rows] = await conn.query(query, [OrgId]);
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