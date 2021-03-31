const fs = require( 'fs' );
const path = require( 'path' );

function change( epubsDirectory, isbnMap ) {
    Object.keys( isbnMap ).sort().forEach( nonstandardIsbn => {
        let epubDirectory = path.join( epubsDirectory, nonstandardIsbn );
        let stats;
        try {
            stats = fs.statSync( epubDirectory );
            if ( stats.isDirectory() ) {
                const standardIsbn = isbnMap[ nonstandardIsbn ].libraryIsbn;
                const newDirectory = path.join( epubsDirectory, standardIsbn );

                fs.renameSync( epubDirectory, newDirectory );

                changeFileNames( epubDirectory, nonstandardIsbn, standardIsbn );
                changeFileContents( epubDirectory, nonstandardIsbn, standardIsbn );
            } else {
                warning( `Skipping ${ epubDirectory } - not a directory` );
            }
        } catch ( e ) {
            // Continue
        }
    } );
}

function changeFileContents( root, match, replace ) {
    console.log( `Changing file contents in ${ root } - ${match} -> ${replace}` );
}

function changeFileNames( root, match, replace ) {
    console.log( `Changing file names in ${ root } - ${ match } -> ${ replace }` );
}

function warning( warningMessage ) {
    console.error( `WARNING: ${ warningMessage }` );
}

module.exports = change;
