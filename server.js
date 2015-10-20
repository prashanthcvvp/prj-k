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
                                       db.projectK.insert({
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
