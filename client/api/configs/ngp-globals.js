/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

(function (window) {
    'use strict';
    var ngp = window.ngp = window.ngp || {};
    ngp.const = {
        app: {
            name: 'node-game-platform',
            domain : 'mygametests.info',
            url : 'http://mygametests.info',
            ajaxUrl : 'http://mygametests.info/ajaxHandler',
            rootScope : {
                initChat : false,
                channels : []
            }
        }
    };
}(window));