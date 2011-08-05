node-spotify
============
Extremely simple (and somewhat hackish) API library for the Spotify REST API.
It's currently _not_ in `npm`.

API
---
Currently, there's only three (useful) methods available:
`lookup: function({ type: 'artist OR album OR track', id: 'Spotify ID Hash', hollaback)`
`search: function({ type: 'artist OR album OR track', query: 'My search query', hollaback)`
`get: function(query, hollaback)` -- See http://developer.spotify.com/en/metadata-api/overview/

Example
-------
```javascript
var spotify = require('node-spotify');

spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    // Do something with 'data'
});
```
