const fs = require( 'fs' );
const path = require( 'path' );

const changeIsbn = require( './lib/change-isbn' );

function main() {
    const ISBN_MAP = require( './node_modules/dlts-open-square-standard-identifiers/map-of-nonstandard-isbns-to-standard-isbns.json' );

    const args = process.argv.slice( 2 );

    if ( args.length !== 1 ) {
        usage();
        process.exit( 1 );
    }

    const epubsDirectory = path.resolve( args[ 0 ] );
    let stats;
    try {
        stats = fs.statSync( epubsDirectory );
    } catch( e ) {
        error( `${ epubsDirectory } does not exist.` );
    }
    if ( ! stats.isDirectory() ) {
        error( `{ epubsDirectory } is not a directory.` );
    }

    Object.keys( ISBN_MAP ).sort().forEach( nonstandardIsbn => {
        let epubDirectory = path.join( epubsDirectory, nonstandardIsbn );
        let stats;
        try {
            stats = fs.statSync( epubDirectory );
            if ( stats.isDirectory() ) {
                changeIsbn( epubDirectory, nonstandardIsbn, ISBN_MAP[ nonstandardIsbn ].libraryIsbn );
            } else {
                warning( `Skipping ${ epubDirectory } - not a directory` );
            }
        } catch ( e ) {
            // Continue
        }
    } );
}

function warning( warningMessage ) {
    console.error( `WARNING: ${ warningMessage }` );
}

function error( errorMessage ) {
    console.error( `ERROR: ${ errorMessage }` );
    usage();
    process.exit( 1 );
}

function usage() {
    console.log( 'Usage: node main.js DIRECTORY_CONTAINING_EXPLODED_EPUBS' );
}

main();

