const fs = require( 'fs' );
const path = require( 'path' );

const changeIsbn = require( './lib/change-epub' );

const ISBN_MAP = require( './node_modules/dlts-open-square-standard-identifiers/map-of-nonstandard-isbns-to-standard-isbns.json' );

function main() {
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

    changeIsbn( epubsDirectory, ISBN_MAP );
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

