
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/traffic_data';

router.get('/section_route_data', function(req, res, next) {

    var section_id = req.query.section_id;
    var selectData = function(db, callback) {
        //连接到表
        var collection = db.collection('section_run_data');
        //查询数据
        collection.find({"section_id" : parseInt(section_id)},
            {
                "from_station_id":0,
                "id":0,
                "stay_time":0,
                "from_station_name":0,
                "_id":0
            })
            .toArray(function(err, result) {
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

router.get('/route_search', function(req, res, next) {

    var route_id = req.query.route_id;
    console.log(typeof (route_id),route_id);
    var selectData = function(db, callback) {
        //连接到表
        var collection = db.collection('all_routes');
        //查询数据
        var whereStr = {}
        collection.find({sub_route_id:{$regex:route_id}}).toArray(function(err, result) {
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

router.get('/section_heat', function(req, res, next) {
    var date_extent = req.query.date_extent;
    console.log(new Date(date_extent[0]));
    var selectData = function(db, callback) {
        //连接到表
        var collection = db.collection('section_run_data');
        //查询数据
        collection.find({"start_date_time" : {$gte:new Date(date_extent[0]),$lte:new Date(date_extent[1])}},
            {
                "from_station_id":0,
                "id":0,
                "stay_time":0,
                "from_station_name":0,
                "_id":0
            })
            .toArray(function(err, result) {
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
