const fs = require( 'fs' );
const path = require( 'path' );

const replaceInFile = require('replace-in-file');

const FILENAME_EXTENSIONS = [
    '.css',
    '.ncx',
    '.opf',
    '.xhtml',
    '.xml',
]

function standardizeEpubIsbns( epubsDirectory, isbnMap ) {
    Object.keys( isbnMap ).sort().forEach( nonstandardIsbn => {
        let epubDirectory = path.join( epubsDirectory, nonstandardIsbn );
        let stats;
        try {
            stats = fs.statSync( epubDirectory );
            if ( stats.isDirectory() ) {
                const standardIsbn = isbnMap[ nonstandardIsbn ].libraryIsbn;
                const newDirectory = path.join( epubsDirectory, standardIsbn );

                // The order of these transformations is important.
                // The renaming of the directory must be done last.
                changeFileNames( epubDirectory, nonstandardIsbn, standardIsbn );
                changeFileContents( epubDirectory, nonstandardIsbn, standardIsbn );
                fs.renameSync( epubDirectory, newDirectory );
            } else {
                warning( `Skipping ${ epubDirectory } - not a directory` );
            }
        } catch ( e ) {
            // Continue
        }
    } );
}

function changeFileContents( root, match, replace ) {
    const filesToChange = [];
    function addFiles( dir ) {
        const entries = fs.readdirSync( dir, { withFileTypes : true } );
        entries.forEach( entry => {
            if ( entry.isFile() ) {
                const filename = entry.name;
                if ( FILENAME_EXTENSIONS.includes( path.extname( filename ) ) ) {
                    filesToChange.push( path.join( dir, filename ) );
                }
            } else if ( entry.isDirectory() ) {
                addFiles( path.join( dir, entry.name ) );
            }
        } );
    }
    addFiles( root );

    replaceInFile.sync( {
        files        : filesToChange,
        from         : new RegExp( match, 'g' ),
        to           : replace,
        countMatches : true,
    } );
}

function changeFileNames( root, match, replace ) {
    // Note that we are not changing directory names because that is more complicated.
    // We would need to avoid renaming a directory before the directories and
    // files nested within it are renamed using the old pathnames.
    // It seems unlikely that there will be EPUBs that contain subdirectories with
    // ISBNs in their names.

    const filesToRename = [];
    function addFiles( dir ) {
        const entries = fs.readdirSync( dir, { withFileTypes : true } );
        entries.forEach( entry => {
            if ( entry.isFile() ) {
                const filename = entry.name;
                if ( filename.includes( match ) ) {
                    filesToRename.push(
                        {
                            old : path.join( dir, filename ),
                            new : path.join( dir, filename.replace( new RegExp( match ), replace ) ),
                        } );
                }
            } else if ( entry.isDirectory() ) {
                addFiles( path.join( dir, entry.name ) );
            }
        } );
    }
    addFiles( root );

    filesToRename.forEach( fileToRename => {
        fs.renameSync( fileToRename.old, fileToRename.new );
    } );
}

function warning( warningMessage ) {
    console.error( `WARNING: ${ warningMessage }` );
}

module.exports = standardizeEpubIsbns;
