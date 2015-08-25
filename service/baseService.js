var request = require('request');
var myutil = require('./util');

var BaseService = function() {
    this.baseUrl = "";
};

/* 获取七日活跃tenant列表信息
 *
 * 
 */
BaseService.prototype.getWeeklyActiveTenants = function(param, succ, fail) {
    console.log("get active tenants!");
    var self = this;
    var dates = myutil.getLast7Days(param);

    var queryUrl = self.baseUrl+ "/business/login/_search?pretty=true";
    var queryData = {
        query :{
            query_string:{
                query : '_id:("'+dates[0]+'"or"'+dates[1]+'"or"'+dates[2]+'"or"'+dates[3]+'"or"'+dates[4]+'"or"'+dates[5]+'"or"'+dates[6]+'")'
            }
        },
        "sort":[{"timestamp":{"order":"desc","ignore_unmapped":true}}]
    };



    doPost(queryUrl, queryData, function(resData){
        var values = resData.hits.hits;
        var msg = [];

        //日期从大到小
        for(var i=0; i< values.length; i++){

            delete values[i]._source["timestamp"];
            var tenantList = [];

            for(var key in values[i]._source) {
                var temp0 = {
                    tenantId: key,
                    count: values[i]._source[key],
                    companyName: "",
                    companyId: ""
                };
                tenantList.push(temp0);
            }

            var temp = {
                name : dates[i],
                tenantList : tenantList,
                count : tenantList.length
            };

            msg.push(temp);
        }

        self.getTodayActiveTenant(values[0]._source, function(todayList) {
            msg[0].tenantList = todayList;

            succ(msg);
        },fail);

    }, fail);
};

/* 获取当日活跃tenant详细信息
 *
 * return msg: [{tenantId:"", count: , companyName:"", companyId: ""}]
 */
BaseService.prototype.getTodayActiveTenant = function(tenantList, succ, fail) {
    console.log("get today active tenants!");
    var self = this;
    var msg = [];

    var querystring = '_id:("';
    var count = 0;

    for(var key in tenantList) {
        if(key != "timestamp"){
            if(count == 0){
                querystring += key + '"';
            }
            else{
                querystring += 'or"'+ key + '"';
            }
            count++;

            msg.push({tenantId:key, count:tenantList[key], companyName:"", companyId : ""});
        }
    }
    querystring += ')';

    var queryUrl = self.baseUrl+ "/business/tenant/_search?pretty=true";
    var queryData = {
        query :{
            query_string:{
                query : querystring
            }
        },
        "sort":[{"tenantId":{"order":"desc","ignore_unmapped":true}}],
        "size": 50
    };

    //获取tenant详细信息
    doPost(queryUrl, queryData, function(resDetail) {
        var tenantsDetail = resDetail.hits.hits;

        msg.sort(function(a,b){return parseInt(b.tenantId)-parseInt(a.tenantId);});//按照tenantId递减排序

        for(var i=j=0; i<tenantsDetail.length;) {
            if(tenantsDetail[i]._source.tenantId == msg[j].tenantId){
                msg[j].companyName = tenantsDetail[i]._source.companyName;
                msg[j].companyId = tenantsDetail[i]._source.companyId;
                i++;
                j++;
            }
            else{
                j++;
            }
        }
        msg.sort(function(a,b){return b.count- a.count;});

        succ(msg);

    }, fail);
};

/* 获取七日活跃用户列表详细信息
 *
 * return {msg: [{name:"2015-03-02",count: , userList : []}], group: []}
 */
BaseService.prototype.getWeeklyActiveUsers = function(param, succ, fail) {
    console.log("get active users!");
    var self = this;
    var dates = myutil.getLast7Days(param);

    var queryUrl = self.baseUrl+ "/user/login/_search?pretty=true";
    var queryData = {
        query :{
            query_string:{
                query : '_id:("'+dates[0]+'"or"'+dates[1]+'"or"'+dates[2]+'"or"'+dates[3]+'"or"'+dates[4]+'"or"'+dates[5]+'"or"'+dates[6]+'")'
            }
        },
        "sort":[{"lastLoginDate":{"order":"desc","ignore_unmapped":true}}]
    };

    //时间递减
    doPost(queryUrl, queryData, function(resData) {
        var values = resData.hits.hits;
        var msg = [];

        for(var i=0; i<values.length; i++) {
            var userList = values[i]._source.doc.sort(function(a,b){
                if(a.customerId > b.customerId){
                    return 1;
                }
                if(a.customerId < b.customerId){
                    return -1;
                }
                return 0;
            });
            for(var j=0; j<userList.length; j++) {
                userList[j].isKeyUser = userList[j].isKeyUser == 1?true:false;
            }
            var temp = {
                name : dates[i],
                userList : userList,
                count : userList.length
            };

            msg.push(temp);
        }

        //按公司分组统计当日活跃用户
        var group = [];
        var users = msg[0].userList;
        var user = {id: "", name: "", count: 0};

        for(var k=0 ; k<users.length; k++) {
            var temp = {};
           if(user.id == users[k].customerId){
               user.count++;
           }
           else {
               temp.id = user.id;
               temp.name = user.name;
               temp.count = user.count;
               group.push(temp);
               user.count = 1;
               user.name = users[k].customerName;
               user.id = users[k].customerId;
           }
        }
        group.push(user);
        //maybe add other code

        group.sort(function(a,b){return b.count- a.count;});

        group.pop();

        var resMsg = {msg:msg, group:group};

        succ(resMsg);

    }, fail);
};

//获取新增tenant和user信息
BaseService.prototype.getNewTenantAccount = function(param, succ, fail) {
    var self = this;
    var dates = myutil.getLast7Days(param);

    var url = self.baseUrl+ "/business/customer/_search?pretty=true";
    var data = {
        query :{
            query_string:{
                query : '_id:("'+dates[0]+'"or"'+dates[1]+'"or"'+dates[2]+'"or"'+dates[3]+'"or"'+dates[4]+'"or"'+dates[5]+'"or"'+dates[6]+'"or"'+dates[7]+'")'
            }
        },
        "sort":[{"timestamp":{"order":"desc","ignore_unmapped":true}}]
};



    doPost(url, data, function(resData){
        var values = resData.hits.hits;
        var msg = [];

        //日期从大到小
        for(var i=0; i< dates.length-1; i++){

            var temp = {
                name : dates[i],
                newTenant : values[i]._source.newCustomer||0,
                totalTenants : values[i]._source.totalCustomer||0,
                newUser : values[i]._source.newUser || 0,
                totalUsers : values[i]._source.totalUser || 0
            };

            msg.push(temp);
        }

        succ(msg);

    }, fail);

};

//doPost
var doPost = function(url, body, succ, fail) {
    console.log("doPost");

    var opts = {
        url : url,
        body : JSON.stringify(body),
        method: "POST"
    };

   doRequest(opts, succ, fail);
};

//doGet
var doGet = function(url, succ, fail) {
    console.log('doGet');
    var opts = {
        url : url,
        method: "GET"
    };

    doRequest(opts, succ, fail);
};

//doRequest
var doRequest = function(opts, succ, fail) {

    opts.headers = {'Accept':'application/json'};

    request(opts, function(err, res, data){
        if(err) {
            fail(err);
        }
        else {
            succ(JSON.parse(data));
        }
    });
};



module.exports = new BaseService();