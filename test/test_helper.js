require('babel-register')(); // eslint-disable-line import/no-extraneous-dependencies

const chai = require('chai');
const chaiImmutable = require('chai-immutable');
const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

require.extensions['.css'] = () => {};

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'node.js',
};

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

chai.use(chaiImmutable);

// this has to happen after the globals are setup
// the require flow is: chai-enzyme > enzyme > react > fbjs/lib/ExecutionEnvironment
// so, we need to initialize globals before requiring chai-enzyme
// this allows .unmount() to work
// https://github.com/airbnb/enzyme/issues/395#issuecomment-239352075
chai.use(require('chai-enzyme')());
