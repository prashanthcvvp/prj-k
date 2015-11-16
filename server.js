<<<<<<< HEAD
#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var jsdom = require("jsdom");
var firebase = require('firebase');

var firebaseRef = new firebase("https://projectk.firebaseio.com/");


/**
 *  Define the sample application.
 */
var SampleApp = function() {
    var arrayJson =[];
    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
        
        self.routes['/update-db']=function(req,res){
            firebaseRef.remove();
=======
var express = require('express');
var http_req = require('request');
var jsdom = require("jsdom");
var mongojs = require('mongojs');

db=mongojs('projectK',['projectK']);

var expressApp = express();
var arrayJson =[];

expressApp.get('/',function(req,res){
    db.projectK.remove(function(error,result){
        if(error){
            console.log('Error!!');
        }else{
            console.log('Removed');
            console.log("Get request");
>>>>>>> origin/master
            jsdom.env(
              "http://villinois.museum.state.il.us/jquery-map",
              ["http://code.jquery.com/jquery.js"],
                function (err, window) {
                    var $ = window.$;
                    var array=($(".pager-last > a").attr('href')).split('=');
                  for(i=0;i<=array[1];i++){
                    console.log("http://villinois.museum.state.il.us/jquery-map?page="+i);

                    jsdom.env(
                        "http://villinois.museum.state.il.us/jquery-map?page="+i,
                        ["http://code.jquery.com/jquery.js"],
                        function(err,window){
                            var $ =window.$;
                                $('.even').each(function(index){
                                    if($(this).children(".views-field-title").text().length>0){
<<<<<<< HEAD
                                       firebaseRef.push({
=======
                                       db.projectK.insert({
>>>>>>> origin/master
                                            title:$(this).children(".views-field-title").text().trim(),
                                            body:$(this).children(".views-field-body").text().trim(),
                                            geo:$(this).children(".views-field-field-geolocation").text().trim(),
                                            tags:$(this).children(".views-field-field-tags").text().trim(),
                                            topic:$(this).children(".views-field-field-topic").text().trim(),
                                            time:$(this).children(".views-field-field-time").text().trim(),
                                            location:$(this).children(".views-field-field-location").text().trim(),
                                            regions:$(this).children(".views-field-field-regions").text().trim()
                                       });
                                    }
                                });
                                window.close();
                                console.log(' success');
                            });          
                  }   
              });
<<<<<<< HEAD
             res.send("success");
        };
        
        self.routes['/getPlaces']=function(req,res){
            arrayJson=[];
            firebaseRef.orderByValue().on("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    arrayJson.push(data.val());
                });
                console.log(arrayJson.length);
                res.json(arrayJson);
            });
            
        };
        
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

=======
            //res.send("success");
        }
    });
});

expressApp.get('/getPlaces',function(req,res){
    db.projectK.find(function(err,docs){
       if(err){
           console.log("Database error");
       }else{
           res.json(docs);
       }
    });
});
expressApp.listen("3000");
console.log("Server on port 3000");
>>>>>>> origin/master
