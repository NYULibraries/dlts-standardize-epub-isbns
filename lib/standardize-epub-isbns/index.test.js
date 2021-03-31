"use strict";

const dircompare = require( 'dir-compare' );
const fsExtra    = require( 'fs-extra' );
const path       = require( 'path' );
const rimraf     = require( 'rimraf' );

const standardizeEpubIsbns = require( './index.js' );

const EXPECTED_EXPLODED_EPUBS = path.resolve( __dirname, '../../test/expected/exploded-epubs' );
const FIXTURES_EXPLODED_EPUBS = path.resolve( __dirname, '../../test/fixtures/exploded-epubs' );
const TMP_EXPLODED_EPUBS = path.resolve( __dirname, '../../test/tmp/exploded-epubs' );

describe( 'standardizeEpubIsbns', () => {

    beforeAll( () => {
        rimraf.sync( path.join( TMP_EXPLODED_EPUBS, '!(.gitkeep)' ) );
        fsExtra.copySync( FIXTURES_EXPLODED_EPUBS, TMP_EXPLODED_EPUBS );
    } );

    it(
        'should correctly changes the ISBNs in the top-level directory name, filenames, and file contents',
        () => {
            standardizeEpubIsbns( TMP_EXPLODED_EPUBS );

            const options = {
                compareContent : true,
                excludeFilter  : '.gitkeep',
            };

            const dirCompareResults = dircompare.compareSync(
                EXPECTED_EXPLODED_EPUBS,
                TMP_EXPLODED_EPUBS,
                options,
            )

            expect.extend(
                {
                    toShowDirectoriesAreTheSame(
                        dirCompareResults,
                        dir1,
                        dir2,
                    ) {
                        if ( dirCompareResults.same ) {
                            return {
                                message : () =>
                                    `expected ${ dir1 } and ${ dir2 } not to be the same  `,
                                pass    : true,
                            };
                        } else {
                            return {
                                message : () =>
                                    `expected ${ dir1 } and ${ dir2 } to be the same  `,
                                pass    : false,
                            };
                        }
                    }
                }
            );

            expect( dirCompareResults )
                .toShowDirectoriesAreTheSame( EXPECTED_EXPLODED_EPUBS, TMP_EXPLODED_EPUBS );
        }
    );
} );
