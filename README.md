# DLTS Standardize EPUB ISBNS

## Description

Motivation: [NYUP-753: Use standard ISBN type for Open Square EPUB identifiers](https://jira.nyu.edu/jira/browse/NYUP-753)

Starting in 2021, DLTS Open Square will use library ISBNs exclusively for identifiers.
All new EPUBs given to DLTS by NYU Press will be for the library
ISBN versions of the titles.
However, there are backlist books for which no library ISBN versions are available.
We need to remediate these older EPUBs, replacing the nonstandard (non-library)
ISBNs with standard (library) ISBNs using the map provided by 
[dlts\-open\-square\-standard\-identifiers](https://github.com/NYULibraries/dlts-open-square-standard-identifiers).

This script will remediate a directory of exploded EPUBs, performing the following
ISBN-related changes:

* Rename all top-level ISBN-named directories
  * Example: `9780814711774/` -> `9780814725078/`
  * Any top-level directories whose names do not match nonstandard identifiers in the map
  will be ignored.
  * Subdirectories (directories below the level of the ISBN-named top-level directories) are
  not renamed.  Processing subdirectories is trickier because if there are nested
  occurrences of the nonstandard ISBN the ordering of the renaming matters (depth-first),
  and it might not be worth the effort given that to date there have been no EPUBs
  that use ISBNs in the subdirectory names, and it would seem to be something
  unlikely to ever be done by a vendor.  This feature might be considered for a
  future enhancement.
  
* Rename all files
  * Example: `9780814711774/ops/9780814711774.opf` -> `9780814725078/ops/9780814725078.opf`
  * Any files whose names do not contain a nonstandard identifier from the map
  will be ignored.
* Replace all occurrences of the nonstandard identifier with the standard identifier
 in the content of files - example:
  ```xml
  <dc:identifier id="p9780814711774">9780814711774</dc:identifier>
  ```
  ...becomes:
  ```xml
  <dc:identifier id="p9780814725078">9780814725078</dc:identifier>
  ```
  * Only files named with these extensions will be processed:
    * .css
    * .ncx
    * .opf
    * .xhtml
    * .xml

## Prerequisities

* Node.js
* [yarn](https://yarnpkg.com/) for installing the dependencies (`npm install`
  sometimes fails)

## Usage

```shell
git clone git@github.com:NYULibraries/dlts-standardize-epub-isbns.git
cd dlts-standardize-epub-isbns
yarn
# Print usage message
node main.js
# Do ISBN changes for a directory of exploded EPUBs - all changes are done in-place
node main.js ../exploded-epubs/
```

## Running the tests

```
# Run acceptance tests
test/test.sh

# Run library code tests
jest
```

## Future enhancements

* Remediate zipped *.epub files
* Rename subdirectories?
