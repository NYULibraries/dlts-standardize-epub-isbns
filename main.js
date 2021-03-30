const fs = require( 'fs' );
const path = require( 'path' );

const changeIsbn = require( './lib/change-isbn' );

const ISBN_MAP = require( './node_modules/dlts-open-square-standard-identifiers/map-of-nonstandard-isbns-to-standard-isbns.json' );

// Copy fixtures into tmp
changeIsbn( 'root', 'old isbn', 'new isbn' );
