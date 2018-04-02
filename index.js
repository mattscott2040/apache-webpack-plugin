'use strict'

var apache = require('apache-bridge');

var isDevServer = function() {
    return Boolean(process.argv.find(v => v.includes('webpack-dev-server')));
    // Source: https://stackoverflow.com/a/36728755
}
  
function apacheWebpackPlugin(options) {
    
    this.port = options.port;
    this.hostname = options.hostname;
    this.server = null;

    let onCreateServer = options.onCreateServer;

    // Only initialize if is webpack-dev-server
    if(isDevServer()) {
        
        this.server = apache.createServer();
        this.server.bin = options.bin; // Set bin directory
        this.server._conf.file = options.conf; // Set conf file

        // Log errors
        this.server.on('error', function (err) {
            console.log(err.toString());
        });

        // Trigger exit if Apache closes
        this.server.on('close', function () {
            console.log('Apache stopped.');
            process.exit(0);
        });

        // Typecast as Array to allow multiple callbacks
        if(!Array.isArray(onCreateServer)) {
            onCreateServer = [onCreateServer];
        }
        
        // Loop through all callbacks
        let arrayLength = onCreateServer.length;
        for (var i = 0; i < arrayLength; i++) {
            if(onCreateServer[i]) {
                onCreateServer[i](this.server, this, options);
            }
        }

    }

}

apacheWebpackPlugin.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('done', function(c) {
        // If server is instantiated (only for webpack-dev-server)
        if(self.server) {
            // Start Apache
            console.log('Starting Apache...');
            self.server.listen(self.port, self.hostname, function() {
                console.log('Apache is ready!');
            });
        }
    });
};
  
module.exports = apacheWebpackPlugin;