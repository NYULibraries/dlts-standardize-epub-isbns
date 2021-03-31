const fs = require( 'fs' );
const path = require( 'path' );

const standardizeEpubIsbns = require( './lib/standardize-epub-isbns' );

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

    standardizeEpubIsbns( epubsDirectory );
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

