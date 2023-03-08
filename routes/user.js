var logger = require('../log.js').logger;

var database;
var UserSchema;
var UserModel;

var init = function(db) {
    console.log('init 호출됨');

    database = db;
    UserSchema = db.UserSchema;
    UserModel = db.UserModel;
}

var authUser = function(database, id, password, callback){
    console.log('authUser 호출'+id+', '+password);
    
    UserModel.findById(id,function(err,results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);
        
        if(results.length >0){
            console.log('아이디와 일치하는 사용자 찾음.');
            
            if(results[0]._doc.password ==password){
                console.log('비밀번호 찾음');
                callback(null,results);
            }else{
                console.log('비밀번호 일치하지 않음');
                callback(null,null);
            }
        }else{
            console.log("아이디와 일치하는 사용자를 찾지 못함.");
            callback(null,null);
        }
    });
};


var addUser = function(database, name,id,password,tel,address,callback){
    console.log('addUser 호출됨: '+ id+', '+password);
    
    var user = new UserModel({"name": name, "id":id, "password":password, "tel": tel, "address":address});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("사용자 데이터 추가함.");
        callback(null,user);
    });
};

var adduser = function(req,res){
    console.log('/process/adduser 호출됨.');
    
    var paramName = req.body.name || req.query.name;
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramTel = req.body.tel || req.query.tel;
    var paramAddress = req.body.address || req.query.address;
    var context;
    var database = req.app.get('database');
                                                                                      
    if(database){
        addUser(database,paramName,paramId,paramPassword,paramTel,paramAddress,function(err,result){
            if(err) {throw err;}
            if (result)
                context = {title : '회원가입 성공', description: '회원가입이 정상적으로 되었습니다.' , curID : result._doc.id, curName : result._doc.name};
            else
                var context = {title : '회원가입 실패', description: '회원가입이 되지 않았습니다.' , curID : ' ', curName : ' '};
            
            req.app.render('adduser', context, function(err,html){  
                if(err) throw err;
                res.end(html);
            });
        });
    }
}

            
var login = function(req, res){
    console.log('user 모듈 안에서 login 호출됨.');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var context = {};
    
    if(req.session.user) {
        UserModel.findById(req.session.user.id, function(err, result){
            if(result.length > 0) {
                context = {title : '로그인 실패', description: '이미 로그인 한 상태입니다.' , curID : '', curName : ''};
                req.app.render('login', context, function(err,html){
                    if(err) throw err;
                    res.end(html);
                })
            }
        })
    }
    
    else {    
        if(database) {
            authUser(database, paramId, paramPassword, function(err, docs){
                if(err) {throw err;}
                if(docs) {
                    logger.info(`서버에 로그인 하였습니다. (${paramId})`);
                    context = {title : '로그인 성공', description: '로그인에 성공하였습니다.' , curID : docs[0]._doc.id, curName : docs[0]._doc.name};
                    
                    req.session.user = {
                        id : docs[0]._doc.id,
                        name : docs[0]._doc.name,
                        authorized : true
                    }
                }
                else {
                    context = {title : '로그인 실패', description: '로그인에 실패하였습니다.' , curID : ' ', curName : ' '};
                }    
                req.app.render('login', context, function(err,html){
                    if(err) throw err;
                    res.end(html);
                })
            })
        }
    }
}



var logout = function(req,res) {
    console.log('/process/logout 호출됨.');
    var id = req.session.user.id;
    
    var context;
    
    if(req.session.user){
        console.log('로그아웃 합니다.');
        
        req.session.destroy(function(err){
            if(err){
                context = {title: '로그아웃 실패', description : '로그아웃에 실패하였습니다.'}
            }
            logger.info(`서버에서 로그아웃 되었습니다. (${id})`);
            context = {title : '로그아웃 성공', description: '로그아웃 되었습니다.'};
            req.app.render('logout', context, function(err,html){
                if(err) throw err;
                res.end(html);
            })    
        })
    }
    
    else{
        context = { title:'로그아웃 실패', description : '로그인 상태가 아닙니다.'}    
        req.app.render('logout', context, function(err,html){
        if(err) throw err;
        res.end(html);
        })
    }
}

var modifyUser = function(req, res){
    console.log('modifyUser 호출됨.');
    var context;
    
    if(req.session.user) {
        UserModel.findById(req.session.user.id, function(err, result){
            if(result.length > 0) {
                context = {title : '주문자 정보 수정하기', description: '주문자 정보를 수정합니다.', curTel : result[0]._doc.tel, curAddress : result[0]._doc.address}; 
                req.app.render('modify', context, function(err,html){
                    if(err) throw err;
                    res.end(html);
            });
            }
        })
    }
}

var modifyuser = function(req, res){    
    console.log('/process/modifyuser 호출됨.');    

    var paramTel = req.body.tel || req.query.tel;
    var paramAddress = req.body.address || req.query.address;
    var context;

    UserModel.update({tel : paramTel, address : paramAddress}, function(err){    
        
        context = {title : '주문자 정보 수정 완료', description: '주문자 정보를 수정하였습니다.', curTel : paramTel, curAddress: paramAddress};
        
        req.app.render('modify2', context, function(err,html){
            if(err) throw err;
            res.end(html);
        });
    });
}



module.exports.login=login;
module.exports.adduser = adduser;
module.exports.logout = logout;
module.exports.modifyUser = modifyUser;
module.exports.modifyuser = modifyuser;
module.exports.init = init;
