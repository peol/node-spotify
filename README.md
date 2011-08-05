node-spotify
============

Extremely simple (and somewhat hackish) API library for the Spotify REST API.
It's currently _not_ in `npm`.

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
});```
