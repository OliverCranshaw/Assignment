const db = require('../../config/db');

exports.getAllEvents = async function(sortBy) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        group by E.id order by ' + sortBy

    const [rows] = await conn.query(query);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;

};

exports.get

exports.getQuery = async function(sortBy, search) {

    search = '%' + search + '%';

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where (title like ? or description like ?) group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where category_id in (?) group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where organizer_id = ? group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where (title like ? or description like ?) and category_id in (?) group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where (title like ? or description like ?) and organizer_id = ? group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where category_id in (?) and organizer_id = ? group by E.id order by ' + sortBy

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
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees" \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where (title like ? or description like ?) and category_id in (?) and organizer_id = ? \
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
    const query = 'select * from category where id = ?';
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

exports.insert = async function( title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, userId ) {
    console.log( `Request to insert event into the database...` );

    let idCreated = 0;

    const conn = await db.getPool().getConnection();
    const query = 'insert into event (title, description, date, is_online, url, venue, capacity, requires_attendance_control, fee, organizer_id) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
    const [ rows ] = await conn.query( query, [ title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, userId ] );
    conn.release();

    return rows;
};

exports.insertCat = async function( eventId, catId ) {
    console.log( `Request to insert event categories into the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_category (event_id, category_id) values ( ?, ? )';
    const [ rows ] = await conn.query( query, [ eventId, catId ] );
    conn.release();
    return rows;
};

exports.getEvent = async function( eventId ) {

    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    const query =
        'select E.id as "eventId", title, group_concat(distinct category_id) as "categories", first_name as "organizerFirstName", \
        last_name as "organizerLastName", capacity, count(distinct case when (EA.attendance_status_id = 1 and E.id = EA.event_id) then user_id else null end) as "numAcceptedAttendees", description, \
        organizer_id as organizerId, date, is_online as isOnline, url, venue, requires_attendance_control as requiresAttendanceControl, fee \
        from event E join event_category EC on E.id = EC.event_id join user U on E.organizer_id = U.id \
        join event_attendees EA \
        where E.id = ? group by E.id'

    const [rows] = await conn.query(query, [eventId]);
    conn.release();

    for (let i = 0; i < rows.length; i++ ) {
        rows[i].categories = rows[i].categories.split(',').map(Number);
    }
    return rows;
};

exports.retrieveCats = async function( ) {
    console.log( `Request to retrieve categories...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from category order by id';
    const [ rows ] = await conn.query( query );
    conn.release();
    return rows;
};

exports.deleteEvent = async function( eventId ) {
    console.log( `Request to delete event...` );
    const conn = await db.getPool().getConnection();
    const query = 'delete from event where id = ?';
    const [ rows ] = await conn.query( query, [eventId] );
    conn.release();
    return rows;
};

exports.deleteEventCat = async function( eventId ) {
    console.log( `Request to delete event categories...` );
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_category where event_id = ?';
    const [ rows ] = await conn.query( query, [eventId] );
    conn.release();
    return rows;
};

exports.deleteAttendees = async function( eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_attendees where event_id = ?';
    const [ rows ] = await conn.query( query, [eventId] );
    conn.release();
    return rows;
};

exports.checkEvent = async function( title, date, orgId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'select * from event where title = ? and date = ? and organizer_id = ?';
    const [ rows ] = await conn.query( query, [title, date, orgId] );
    conn.release();
    return rows;
};

exports.updateTitle = async function( title, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set title = ? where id = ?';
    const [ rows ] = await conn.query( query, [title, eventId] );
    conn.release();
    return rows;
};

exports.updateDesc = async function( desc, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set description = ? where id = ?';
    const [ rows ] = await conn.query( query, [desc, eventId] );
    conn.release();
    return rows;
};

exports.updateDate = async function( date, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set date = ? where id = ?';
    const [ rows ] = await conn.query( query, [date, eventId] );
    conn.release();
    return rows;
};

exports.updateIsOnline = async function( isOnline, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set is_online = ? where id = ?';
    const [ rows ] = await conn.query( query, [isOnline, eventId] );
    conn.release();
    return rows;
};

exports.updateURL = async function( url, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set url = ? where id = ?';
    const [ rows ] = await conn.query( query, [url, eventId] );
    conn.release();
    return rows;
};

exports.updateVenue = async function( venue, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set venue = ? where id = ?';
    const [ rows ] = await conn.query( query, [venue, eventId] );
    conn.release();
    return rows;
};

exports.updateCapacity = async function( capacity, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set capacity = ? where id = ?';
    const [ rows ] = await conn.query( query, [capacity, eventId] );
    conn.release();
    return rows;
};

exports.updateReqCap = async function( reqCap, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set requires_attendance_control = ? where id = ?';
    const [ rows ] = await conn.query( query, [reqCap, eventId] );
    conn.release();
    return rows;
};

exports.updateFee = async function( fee, eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set fee = ? where id = ?';
    const [ rows ] = await conn.query( query, [fee, eventId] );
    conn.release();
    return rows;
};

exports.deleteAllCat = async function( eventId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'delete from event_category where event_id = ?';
    const [ rows ] = await conn.query( query, [eventId] );
    conn.release();
    return rows;
};

exports.addCategory = async function( eventId, catId ) {
    console.log( `Request to delete event attendees...` );
    const conn = await db.getPool().getConnection();
    const query = 'insert into event_category (event_id, category_id) values (?, ?)';
    const [ rows ] = await conn.query( query, [eventId, catId] );
    conn.release();
    return rows;
};

