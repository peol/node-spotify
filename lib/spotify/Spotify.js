var http = require('http');

module.exports = {
    /**
     * Reverse-lookup a track, artist or album URI
     *
     * @param {Object} Options that should be used to do this query
     *                 `type` and `id` is required
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    lookup: function(opts, hollaback) {
        var query = 'lookup/1/.json?uri=spotify:'+opts.type+':'+opts.id;

        if ( opts.type === 'artist' ) {
            // We include album data on artists to give a bit more context
            query += '&extras=album';
        }

        this.get(query, hollaback);
    },

    /**
     * Search the Spotify library for a track, artist or album
     *
     * @param {Object} Options that should be used to do this query
     *                 `type` and `query` is required
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    search: function(opts, hollaback) {
        var query = '/search/1/'+opts.type+'.json?q='+opts.query;

        this.get(query, hollaback);
    },

    /**
     * Internal method for creating response hollabacks, should not be used on
     * its own
     */
    _makeResponse: function(hollaback) {
        var chunks = '';

        return function(response) {
            response.setEncoding('utf8');

            response.on('data', function(chunk) {
                chunks += chunk;
            });

            response.on('end', function() {
                var json = JSON.parse( chunks ),
                    err = typeof json.code !== 'undefined' ?
                        'Invalid web service call: '+json.description :
                        null;

                hollaback(err, json);
            });
        };
    },

    /**
     * Send a request to the Spotify web service API
     *
     * @param {String} The path for this query, see http://developer.spotify.com/en/metadata-api/overview/
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    get: function(query, hollaback) {
        var host = 'ws.spotify.com',
            server = http.createClient(80, host),
            request = server.request('GET', encodeURI( query ), { 'host': host });

        request.end();
        request
            .on('response', this._makeResponse( hollaback ))
            .on('error', function(err) {
                hollaback(err, {});
            });
    }
};
