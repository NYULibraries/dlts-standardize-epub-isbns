function change( root, match, replace ) {
    changeDirectoryNames( root, match, replace );
    changeFileNames( root, match, replace );
    changeFileContents( root, match, replace );
}

function changeDirectoryNames( root, match, replace ) {
    console.log( `Changing directory names in ${ root } - ${ match } -> ${ replace }` );
}

function changeFileContents( root, match, replace ) {
    console.log( `Changing file contents in ${ root } - ${match} -> ${replace}` );
}

function changeFileNames( root, match, replace ) {
    console.log( `Changing file names in ${ root } - ${ match } -> ${ replace }` );
}

module.exports = change;
