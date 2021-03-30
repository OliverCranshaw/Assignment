const db = require('../../config/db');

exports.getAllEvents = async function(sortBy) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 group by E.id order by ' + sortBy

    const [rows] = await conn.query(query);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getQuery = async function(sortBy, search) {

    search = '%' + search + '%';

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and (title like ? or description like ?) group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [search, search] );
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getCatId = async function(sortBy, catList) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and category_id in (?) group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [catList]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getOrdId = async function(sortBy, ordId) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and organizer_id = ? group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [ordId]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getQueryCat = async function(sortBy, search, catList) {

    search = '%' + search + '%';

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and (title like ? or description like ?) and category_id in (?) group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [search, search, catList]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getQueryOrg = async function(sortBy, search, orgId) {

    search = '%' + search + '%';

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and (title like ? or description like ?) and organizer_id = ? group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [search, search, orgId]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getCatOrg = async function(sortBy, catList, orgId) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and category_id in (?) and organizer_id = ? group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [catList, orgId]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.getQueryCatOrg = async function(sortBy, search, catList, orgId) {

    search = '%' + search + '%';

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct EA.user_id) as "numAcceptedAttendees", capacity \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA on E.id = EA.event_id \
        where EA.attendance_status_id = 1 and (title like ? or description like ?) and category_id in (?) and organizer_id = ? \
        group by E.id order by ' + sortBy

    const [rows] = await conn.query(query, [search, search, catList, orgId]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.checkCat = async function( catId ) {
    console.log( `Request to check catId in the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event_category where category_id = ?';
    const [ rows ] = await conn.query( query, [ catId ] );
    conn.release();
    return rows;
};


exports.getEventCats = async function( eventId ) {
        console.log( `Request to check catId in the database...` );
        const conn = await db.getPool().getConnection();
        const query = 'select group_concat(distinct category_id) as "eventCats" from event join event_category on event.id = event_category.event_id \
        where event.id = ?'
        const [ rows ] = await conn.query( query, [ eventId ] );
        conn.release();

        for (let i = 0; i < rows.length; i++ ) {
            rows[i].eventCats = rows[i].eventCats.split(',').map(Number);
        }

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