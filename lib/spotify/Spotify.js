var http = require('http');
var https = require('https');

/**
 * Internal method for creating response hollabacks, should not be used on
 * its own
 */
function makeResponse(hollaback) {
    var chunks = '';

    return function(response) {
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            chunks += chunk;
        });

        response.on('end', function() {
            var err, json;

            try {
                json = JSON.parse( chunks );
            }
            catch(e) {
                err = e;
                console.log(e);
            }

            hollaback(err, json);
        });
    };
}

module.exports = {
    /**
     * Reverse-lookup a track, artist or album URI
     *
     * @param {Object} Options that should be used to do this query
     *                 `type` and `id` is required
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    lookup: function(opts, hollaback) {
        var type = opts.type+'s';
        var query = '/v1/'+type+'/'+opts.id;       
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
        opts.limit = opts.limit || 20;
        var query = '/v1/search?type='+opts.type+'&q='+opts.query+'&limit='+opts.limit;
        this.get(query, hollaback);
    },

    /**
     * Send a request to the Spotify web service API
     *
     * @param {String} The path for this query, see http://developer.spotify.com/en/metadata-api/overview/
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    get: function(query, hollaback) {
        
        var opts = {
            host: "api.spotify.com",
            path: encodeURI(query),
            method: "GET",
            headers: { "Accept": "application/json" }
        },
        request = https.request(opts, makeResponse( hollaback ));
        request.end();

        request.on('error', function (err) {
            hollaback (err, {});
        });
    },

    /**
     * Send a request to the Spotify web service API
     *
     * @param {Array} List of spotify ids of albums
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    albums: function(ids, hollaback) {
      console.log(ids)
        var query = '/v1/albums?ids=' + ids.join(',')
        this.get(query, hollaback);
    }
};
