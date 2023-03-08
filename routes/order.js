var database;
var OrderSchema;
var OrderModel;

var init = function(db) {
    console.log('init 호출됨');

    database = db;
    OrderSchema = db.OrderSchema;
    OrderModel = db.OrderModel;
}

var addmenu = function(req, res){
    console.log('/process/addmenu 호출됨.');
        
        var lname = req.body.lname || req.query.lname;
        var price = req.body.price || req.query.price;

        if(database) {
            addMenu(database, lname, price, function(err, result) {
                if(err) {throw err;}
                else if (result) {
                    var context = {title : '메뉴 추가', description: '메뉴가 추가되었습니다.' , curLname : lname, curPrice : price};
                    req.app.render('addmenu', context, function(err,html){  
                        if(err) throw err;
                        res.end(html);
                    })
                }
                else{
                    var context = {title : '메뉴 추가', description: '메뉴를 다시 입력해주세요.' , curLname : ' ', curPrice : ' '};
                    req.app.render('addmenu', context, function(err,html){  
                        if(err) throw err;
                        res.end(html);
                    })
                }
            })
        }
}

var addMenu = function(database, lname, price, callback){
    console.log('addMenu 호출됨.');
    
    var menu = new OrderModel({"lname" : lname, "price" : price});
    
    menu.save(function(err){
        if(err) {
            callback(err,null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, menu);
    })
}

var order = function(req, res){
    console.log('order 호출됨.');
    var context;
    
    OrderModel.findAll(function(err,results){
        if(req.session.user){
        if(err) throw err;
        context = {results : results, title : '주문하기', curName : req.session.user.name};
        req.app.render('Order', context, function(err,html){
            if(err) throw err;
            res.end(html);
        });}
    });
}


module.exports.addmenu = addmenu;
module.exports.order = order;
module.exports.init = init;

