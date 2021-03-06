/**
 * Created by Liang Liu on 2018/1/20.
 */
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/traffic_data';
router.get('/station_info', function(req, res, next) {
        var selectData = function(db, callback) {
                var collection = db.collection('station');
        collection.find({}).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selectData(db, function(result) {
            res.json(result);
            db.close();
        });
    });

});

router.get('/route_station', function(req, res, next) {

    var route = req.query.route_id;

    console.log(route);

    var pattern = new RegExp(""+route+"");

    var selectData = function(db, callback) {
        var collection = db.collection('station');
        var whereStr = {}
        collection.find({sub_routes_id:{$regex:pattern}},{
            "sub_routes_id":0,
            "sub_routes_number":0,
            "_id":0,
            "routes_id":0,
            "routes_number":0
        }).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selectData(db, function(result) {
            res.json(result);
            db.close();
        });
    });

});

router.get('/station_name_search', function(req, res, next) {

    var station_name = req.query.station_name;

    console.log(station_name);

    var pattern = new RegExp(""+station_name+"");

    var selectData = function(db, callback) {
                var collection = db.collection('station');
                var whereStr = {}
        collection.find({station_name:{$regex:pattern}},{
            "sub_routes_id":0,
            "sub_routes_number":0,
            "_id":0,
            "routes_id":0,
            "routes_number":0
        }).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selectData(db, function(result) {
            res.json(result);
            db.close();
        });
    });

});

router.get('/sub_routes_numbers', function(req, res, next) {
    var station_id = req.query.station_id;
    var selectData = function(db, callback) {
                var collection = db.collection('station');
                collection.find({"station_id":station_id}).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        selectData(db, function(result) {
            res.json(result);
            db.close();
        });
    });

});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
