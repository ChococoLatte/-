var database;
var EaterySchema;
var EateryModel;

var init = function(db) {
    console.log('init 호출됨');

    database = db;
    EaterySchema = db.EaterySchema;
    EateryModel = db.EateryModel;
}

var add = function(req, res) {
    console.log('eatery 모듈 안에 있는 add 호출됨.');
    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    
    var database = req.app.get('database');

    if (database) {
        addEatery(database, paramName, paramAddress, paramTel, 
                             paramLongitude, paramLatitude, function(err, result) {

                if(err) {throw err;}
                else if (result) {
                    var context = {title : '지점 추가', description: '지점이 추가되었습니다.' , curName : result._doc.name, curAddress : result._doc.address, curTel: result._doc.tel, curLongitude: result._doc.longitude, curLatitude: result._doc.latitude};
                    req.app.render('addeatery', context, function(err,html){  
                        if(err) throw err;
                        res.end(html);
                    })
                }
                else{
                    var context = {title : '지점 추가', description: '지점 위치를 다시 입력해주세요.' , curName :'', curAddress : '', curTel: '', curLongitude:'', curLatitude: ''};
                    req.app.render('addeatery', context, function(err,html){  
                        if(err) throw err;
                        res.end(html);
                    })
                }
            })
        }
    }

var addEatery = function(database, name, address, tel, longitude, latitude, callback) {
    console.log('addEatery 호출됨.');	
    var eatery = new EateryModel({name : name, address : address, tel : tel,
			 geometry : {
				 type : 'Point',
				 coordinates : [longitude, latitude]
			 }
		         }
		 );

    eatery.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }	
        console.log("커피숍 데이터 추가함.");
        callback(null, eatery);
    })
}


var findNear = function(req, res) {
    console.log('eatery 모듈 안에 있는 findNear 호출됨.');
    
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    var maxDistance = 100000;
    var database = req.app.get('database');
	
    if (database) {
       EateryModel.findNear(paramLongitude, paramLatitude,maxDistance, function(err, results) {
                 if (err) {throw err; }
                 else if (results) {
                       console.dir(results);
                       if (results.length > 0) {
                               req.app.render('findnear',{result: results[0]._doc, paramLatitude: paramLatitude, paramLongitude: paramLongitude},function(err,html){
                                   if(err) throw err;
                                   res.end(html);
                               })
                                              
                       }
                }
        })
    }
}

                     
module.exports.findNear = findNear;
module.exports.add = add;
module.exports.init = init;