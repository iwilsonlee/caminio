/*
 * camin.io
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 01/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */
var winston       = require('winston')
  , path          = require('path')
  , util          = require('util');

module.exports = function Logger( caminio ){

  return Logger;

  /**
   * create a new logger instance
   */
  function Logger(){

    var config = {}
    config.colorize = config.colorize || true;

    this.levels = {
      silent: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    };

    config.level = config.level || this.levels.debug;

    var logger = this.logger = new winston.Logger();

    this.warn = log('warn');
    this.error = log('error');
    this.debug = log('debug');
    this.info = log('info');


    if( caminio.env === 'development' )
      this.logger.add(
        winston.transports.Console, { 
          level: 'debug', 
          colorize: true
        });
    else
      this.logger.add(
        winston.transports.File, { 
          level: 'info', 
          colorize: false,
          filename: caminio.config.log.filename
        });

    var self = this;

    /**
     * wrapper for the winston log method
     * determines the level and concatenates arguments
     * @api private
     */
    function log( level ){
      return function() {
        var str = [];
        for(  var i in arguments ){
          var arg = arguments[i];
          if (typeof arg === 'object') {
            if (arg instanceof Error) {
              str.push(arg.stack);
              return;
            }

            str.push(util.inspect(arg));
            return;
          }

          if (typeof arg === 'function') {
            str.push(arg.valueOf());
            return;
          }

          str.push(arg);
        }

        if ( self.levels[level] <= config.level ) {
          self.logger.log(level, str.join(' '));
        }
      };
    }
    
  }

}