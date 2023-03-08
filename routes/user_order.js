var database;
var OrderModel;
var UserModel;
var UOModel;

var init = function(db) {
    console.log('init 호출됨');

    database = db;
    OrderModel = db.OrderModel;
    UserModel = db.UserModel;
    UOModel = db.UOModel;
}

var regorder = function(req, res){
    console.log('/process/regorder 호출됨.');
    var context;
    var mongoose = require('mongoose');
    var _id = mongoose.Types.ObjectId();
    var lname = req.body.lname || req.query.lname;
    var price = req.body.price || req.query.price;
    var id = req.session.user.id;
    
    UOModel.findById(req.session.user.id, function(err, result){
      
        if(result) {
                    regOrder(lname, price,id, function(err,result){
                        if(err) throw err;
                         UOModel.findOneAndUpdate({_id:_id},function(err){
                                if(err) throw err;                    
                                context = {title : '주문 성공', description: '주문이 완료되었습니다.', curLName: lname, curPrice: price};
                                req.app.render('regorder', context, function(err,html){
                                        if(err) throw err;
                                        res.end(html);})
                         })
                    })
            }
        })
}

                     
            
var regOrder = function(lname, price, id,  callback) {
    
    
    var uo = new UOModel({"lname" : lname, "price" : price, "id":id});
    uo.save(function(err){
        if(err) {
            callback(err,null);
            return;
        }
        console.log('데이터 추가함.');
        callback(null, uo);
    });    
}

                              
    

var myorder = function(req, res) { 
    console.log('/process/myorder 호출됨.');
    var context;
        
   UOModel.findById(req.session.user.id, function(err, results){
        if(req.session.user){
            if(err) throw err;
            if(results){
                context = {results : results, title : '주문목록 조회', curName: req.session.user.name};
                req.app.render('myorder', context, function(err,html){
                    if(err) throw err;
                    res.end(html);
                });   
            }
        }
    })
}

var cancle = function(req, res) {
        
    var lname = req.body.lname || req.query.lname;
    var price = req.body.price || req.query.price;    
    var context;

    console.log('/process/cancle 호출됨.');
    
    if(req.session.user){
        OrderModel.findOne({lname:lname}, function(err, docs){
                UOModel.deleteOne({lname:lname, price:price}, function() {
                    console.log('주문 취소 완료.');
                    context = {title : '주문 취소 성공'};
                    req.app.render('cancle', context, function(err,html){
                        if(err) throw err;
                        res.end(html);
                    });
                })
            })
        }
}
   



module.exports.regorder = regorder;
module.exports.myorder = myorder;
module.exports.cancle = cancle;
module.exports.init = init;
