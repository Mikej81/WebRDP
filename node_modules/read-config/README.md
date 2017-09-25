# nodejs-read-config

[![Travis build status](https://travis-ci.org/coditorium/nodejs-read-config.png?branch=master)](https://travis-ci.org/coditorium/nodejs-read-config)
[![dependencies](https://david-dm.org/coditorium/nodejs-read-config.png)](https://david-dm.org/coditorium/nodejs-read-config)
[![Coverage Status](https://coveralls.io/repos/coditorium/nodejs-read-config/badge.svg)](https://coveralls.io/r/coditorium/nodejs-read-config)

[![NPM info](https://nodei.co/npm/read-config.png?downloads=true)](https://www.npmjs.com/package/read-config)

Multi format configuration loader for Node.js.
Features:

- Environmental variables replacement
- Configuration variables replacement
- Overriding configuration properties via environmental variables
- Variable default values
- Hierarchical configurations
- Supported format:
  - [JSON5](http://json5.org/)
  - [YAML](http://en.wikipedia.org/wiki/YAML)
  - [Properties](http://en.wikipedia.org/wiki/.properties)

## How to use

### Environment variable replacement

/tmp/config.json:
``` javascript
{ env1: "%{ENV_VAR1}", env2: "%{ENV_VAR2|def}" }
```
index.js:
``` javascript
var readConfig = require('read-config'),
    config = readConfig('/tmp/config.json');

console.log(config);

//  $ ENV_VAR1=abc node index.js
//  { env1: 'abc', env2: 'def' }
```

- It is possible to change `%` to any other character. Just use `replaceEnv` configuration option.
- It is possible to use default values when environmental variable is not set.

### Configuration overriding with system variables

/tmp/config.json:
``` javascript
{
    rootProp: "rootProp",
    objProp: {
		x: 'X'
	}
}
```
index.js:
``` javascript
var readConfig = require('read-config'),
    config = readConfig('/tmp/config.json', { override: true });

console.log(config);

//  $ ENV_VAR1=abc node index.js
//  { rootProp: 'rootProp', objProp: { x: 'X'} }

//  $ CONFIG_objProp_x=abc node index.js
//  { rootProp: 'rootProp', objProp: { x: 'abc'} }
```

- It is possible to change `CONFIG` to any other character. Just use `override` configuration option.
- It is possible to override existing value or create new one.

### Configuration variable replacement

/tmp/config.json:
``` javascript
{
    text1: "def",
    text2: "abc-@{text1}-ghi"
    number1: 1,
    number2: "@{number1}",
    boolean1: true,
    boolean2: "@{boolean1}",
    null1: null,
    null2: "@{null1}",
	obj1: {
		x: 'X',
		y: '@{./x}', // same as @{obj1.x}
		z: '@{../text1}' // same as @{text1}
	},
	obj2: "@{obj1}"
}
```
index.js:
``` javascript
var readConfig = require('read-config'),
    config = readConfig('/tmp/config.json');

console.log(config);

//  $ node index.js
//  {
//    text1: "def",
//    text2: "abc-def-ghi"
//    number1: 1,
//    number2: 1,
//    boolean1: true,
//    boolean2: true,
//    null1: null,
//    null2: null,
//    obj1: {
//      x: 'X',
//      y: 'X',
//      z: 'def'
//    },
//    obj2: {
//      x: 'X',
//      y: 'X',
//      z: 'def'
//    }
//  }
```

- It is possible to use nested paths like `@{x.y.z}`
- It is possible to use relative paths like `@{./x}` and `@{../y}`
- It is possible to concatenate variables like `@{x}abc@{y}def@{ghi}`

### Configuration hierarchy

/tmp/config-1.json:
``` javascript
{
    a: "a",
    b: "b",
    arr: [1, 2, 3]
}
```
/tmp/config-2.json:
``` javascript
{
    __parent: "/tmp/config-1.json",
    // same as: __parent: "./config-1.json",
    b: "bb",
    c: "aa",
    arr: []
}
```
index.js:
``` javascript
var readConfig = require('read-config'),
    config = readConfig('/tmp/config-2.json');

console.log(config);

//  $ node index.js
//  {
//    a: "a"
//    b: "bb",
//    c: "aa",
//    arr: []
//  }

```

### Hierarchy and basedir

/tmp/config-1.json:
``` javascript
{
    a: "a",
    b: "b",
    arr: [1, 2, 3]
}
```
/home/xxx/config-2.json:
``` javascript
{
    __parent: "config-1", // no directory & extension specified
    b: "bb",
    c: "aa",
    arr: []
}
```
index.js:
``` javascript
var readConfig = require('read-config'),
    config = readConfig('/tmp/config-2.json');

console.log(config);

//  $ node index.js
//  {
//    a: "a"
//    b: "bb",
//    c: "aa",
//    arr: []
//  }
```

### YAML config format

Using YAML representation lookout for special characters like: '%' and '@'.

/tmp/config.yml:
``` javascript
a: "@{LOCAL_VAR}"
b: "%{ENV_VAR}"
c: No quotes needed!
```

## API

### Functions

- **readConfig(paths, [opts])** - Alias for `readConfig.sync(paths, [opts])`.
- **readConfig.sync(paths, [opts])** - Loads configuration file synchronously.
- **readConfig.async(paths, [opts], callback)** - Loads configuration file asynchronously.

All json files are loaded using [JSON5](https://www.npmjs.com/package/json5) library. It means you can add comments, and skip quotes in your config files - thank you json5;).

### Parameters

- **paths** (String/Array) - path (or array of paths) to configuration file. If passed an array of paths than every configuration is resolved separately than merged hierarchically (like: [grand-parent-config, parent-config, child-config]).
- **opts** (Object, optional) - configuration loading options
    - **parentField** - (Boolean/String, default: true) if specified enables configuration hierarchy. It's value is used to resolve parent configuration file. This field will be removed from the result. A string value overrides `__parentField` property name.
    - **optional** - (String/Array, default: []) list of configuration paths that are optional. If any configuration path is not resolved and is not optional it's treated as empty file and no exception is raised.
    - **basedir** - (String/Array, default: []) base directory (or directories) used for searching configuration files. Mind that `basedir` has lower priority than a configuration directory, process basedir, and absolute paths.
    - **replaceEnv** - (Boolean/String, default: false, constraint: A string value must be different than `replaceLocal`) if specified enables environment variable replacement. Expected string value e.g. `%` that will be used to replace all occurrences of `%{...}` with environment variables. You can use default values like: %{a.b.c|some-default-value}.
    - **replaceLocal** - (Boolean/String, default: '@', constraint: A string value must be different than `replaceEnv`) if specified enables configuration variable replacement. Expected string value e.g. `@` that will be used to replace all occurrences of `@{...}` with configuration variables. You can use default values like: @{a.b.c|some-default-value}.
    - **override** - (Boolean/String, default: false) If specified enables configuration overriding with environmental variables like `CONFIG_<propertyName>`.
    - **skipUnresolved** - (Boolean, default: false) `true` blocks error throwing on unresolved variables.

Default **opts** values:
``` javascript
{
    parentField: "__parent",
    optional: [],
    basedir: null,
    replaceEnv: "%",
    replaceLocal: "@",
    skipUnresolved: false
}
```

## Flow

Flow of the configuration loader:

1. Merge all configs passed in **path** parameter with all of their parents (merging all hierarchy)
2. Merge all results to one json object
3. Override configuration with environment variables
4. Resolve environment variables
5. Resolve local variables

### Gulp commands:

- `gulp checkstyle` - runs jshint and jscsrc analysis
- `gulp test` - runs tests
- `gulp test --file test/loader.js` - runs single test file `./test/loader.js`
- `gulp` - alias for `gulp jshint test`
- `gulp test-cov` - runs instrumented tests, generates reports to `./build/test`
- `gulp test-cov --file test/loader.js` - runs single instrumented test file `./test/loader.js`
- `gulp clean` - removes `./build` folder
- `gulp ci` - alias for `gulp clean checkstyle test-cov`

### NPM commands:

- `npm test` - alias for `gulp test`
- `npm run ci` - alias for `gulp ci`
