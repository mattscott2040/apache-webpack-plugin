# apache-webpack-plugin
**Start Apache via `webpack-dev-server`.**

`apache-webpack-plugin` is a plugin for [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) that starts your locally installed `Apache` web server when you run `webpack-dev-server`. This is not a replacement for Apache, so you must have Apache installed in order to use `apache-webpack-plugin` to connect.

`apache-webpack-plugin` is built with [apache-bridge](https://github.com/mattscott2040/apache-bridge).

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
  * [apache.bin](#apachebin)
  * [apache.hostname](#apachehostname)
  * [apache.onCreateServer](#apacheoncreateserver)
  * [apache.port](#apacheport)

## Installation

Install and inject into `package.json` as a `devDependency`:

```bash
npm install apache-webpack-plugin --save-dev
```

or install globally:

```bash
npm install -g apache-webpack-plugin
```

## Usage

### Configure plugin

*webpack.config.js*:
```javascript
// Require apache-webpack-plugin
var Apache = require('apache-webpack-plugin');

module.exports = {
    
    // Set main js file
    entry: './src/webpack/index.js',

    // Set some output options
    output: {
        filename: 'bundle.js',
        path: '/path/to/dist',
    },

    // ...

    // Create instance of Apache plugin
    plugins: [
        new Apache({
            hostname: 'localhost',
            port: 8000
        })
    ]
};
```

See [webpack documentation](https://webpack.js.org/concepts/) for more information about configuration options.

### Set path to Apache

If the path to your Apache `httpd` file is not inclued in your `$PATH` environment variable, you can specify the path explicitly via [apache.bin](#apachebin):

```javascript
        new Apache({
            bin: '/path/to/apache/bin',
            hostname: 'localhost',
            port: 8000
        })
```

You can also manually add the path to `process.env.PATH`:

```javascript
process.env.PATH = '/path/to/apache/bin:' + process.env.PATH;

module.exports = {
    // ...
}
```

### Embed webpack bundle

Most `webpack-dev-server` implementations let `webpack` inject the bundle(s) into the page. Since we will be serving the page with Apache, we have to define a `publicPath` in the `output` block of our `webpack.config.js` and manually embed the any bundles in our HTML.

*webpack.config.js*:
```javascript
    output: {
        filename: 'bundle.js',
        path: '/path/to/dist',
        publicPath: 'http://localhost:8080/js/'
    }
```

*index.php*:
```php
<script src="http://localhost:8080/js/bundle.js"></script>
```

### Start webpack-dev-server

```bash
$ node_modules/.bin/webpack-dev-server
```

See `webpack-dev-server` [usage instructions](https://github.com/webpack/webpack-dev-server#usage) on [GitHub](https://github.com/webpack/webpack-dev-server) for more options for starting the server.

## Documentation

#### apache.bin

- `<string>` Defaults to `''`.

Set path to Apache `bin` directory where Apache `httpd` is located. This may be necessary if the path is not defined in your system's `$PATH` environment variable.

#### apache.hostname

- `<string>` 

The domain name or IP address for the server. Defaults to `localhost`.

#### apache.onCreateServer

- `<Function>` | `<Array>`
  - `server` `<apache_bridge.Server>`
  - `plugin` `<ApacheWebpackPlugin>` Plugin instance. *Note*: This argument will be replaced by an instance of [Apache Connect](https://github.com/mattscott2040/apache-connect) in `v1.0.0` of `apache-webpack-plugin`.
  - `options` `<object>` Original options from `webpack.config.js`.

A function (or array of functions) to be called after the `server` object is created but before Apache starts, to allow integrating libraries that need access to the server configuration.

```javascript
        new Apache({
            // ...
            onCreateServer: function(server, plugin, options) {
                server.on('configure', function(conf) {
                    conf.file = '/path/to/alternate/conf/file.conf';
                    conf.end();
                });
            }
        })
```

See [apache-bridge](https://github.com/mattscott2040/apache-bridge#class-apacheserver) for more details about the `apache_bridge.Server` class.

#### apache.port

- `<number>` 

Port of remote server. Defaults to `80`.