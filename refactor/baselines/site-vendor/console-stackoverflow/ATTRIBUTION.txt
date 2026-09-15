# customStringify attribution

The customStringify function embedded in console-feed 3.2.2, within ArtPlayer's
legacy console bundle, is supplied under Creative Commons Attribution-ShareAlike
4.0 International (CC BY-SA 4.0).

- Author: [Alexander Mills](https://stackoverflow.com/users/1223975/alexander-mills).
- Source: [answer 48254637](https://stackoverflow.com/a/48254637) to
  "JSON.stringify: avoid TypeError: Converting circular structure to JSON".
- Matching revision: [revision 5, 2018-09-19, fixed API record](https://api.stackexchange.com/2.3/revisions/8FD5F52A-B16F-4C66-AB48-830EABB36CC0?site=stackoverflow&filter=withbody).
- The answer credits [Rob W](https://stackoverflow.com/users/938089/rob-w) and
  [his original answer](https://stackoverflow.com/a/11616993); that credit is retained.
- [License and disclaimer](https://creativecommons.org/licenses/by-sa/4.0/),
  [full local license](LICENSE), and [original snippet](SOURCE.js).

Changes: console-feed compiled const declarations to var and formatted the code
for ES3; Parcel subsequently minified it. The matched function's runtime before
minification is exactly reproduced from the snippet. Its algorithm is retained.
ArtPlayer's new TypeScript adapter does not modify this function.

This notice identifies the particular included material and its upstream license.
It does not describe the entire console bundle as MIT-only or replace the other
component licenses listed in /THIRD_PARTY_NOTICES.md. No endorsement is implied.
