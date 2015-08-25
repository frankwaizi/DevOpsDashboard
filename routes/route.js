var express = require('express');
var router = express.Router();
var baseService = require('../service/baseService');
var myutil = require('../service/util');
var ns = require("../data/data.json");

/* GET home page. */
// router.get('/home', function(req, res) {
//     var today = new Date(new Date()-24*60*60*1000).Format("yyyy.MM.dd");
//     console.log(today);

//     baseService.getWeeklyActiveTenants(today, function(result1) {
//         ns.WeeklyAvtiveTenants = result1;
//         var todayActiveTenants = result1[0].tenantList;

//         baseService.getWeeklyActiveUsers(today, function(result2) {
//             baseService.getNewTenantAccount(today, function(result3) {
//                 ns.WeeklyActiveUsers = result2.msg;
//                 ns.WeekLyNewUsersAndTenants = result3;
//                 //ns.GroupUsers = result2.groupUsers;

//                 var todayActiveUsers = result2.msg[0].userList;
//                 var groupUsers = result2.group;
//                 ns.GroupUsers = groupUsers;

//                 var initData = {
//                     activeTenantCount : todayActiveTenants.length,
//                     newTenantCount : result3[0].newTenant,
//                     activeUserCount: todayActiveUsers.length,
//                     newUserCount : result3[0].newUser,
//                     todayActiveTenants : todayActiveTenants,
//                     todayActiveUsers : todayActiveUsers,
//                     groupUsers : groupUsers,
//                     helpers : {
//                         addOne : function(index) {return index+1;}
//                     }
//                 };

//                 res.render('home', initData);

//             },function(err3) {res.status(500).send(err3);});
//         }, function(err2) {res.status(500).send(err2);});
//     }, function(err1){res.status(500).send(err1);});
// });
// 
// /* GET home page. */
router.get('/home', function(req, res) {

    var todayActiveTenants = ns.WeeklyAvtiveTenants[0].tenantList;
    var todayActiveUsers = ns.WeeklyActiveUsers[0].userList;
    var groupUsers = ns.GroupUsers;


    var initData = {
        activeTenantCount : todayActiveTenants.length,
        newTenantCount : ns.WeekLyNewUsersAndTenants[0].newTenant,
        activeUserCount: todayActiveUsers.length,
        newUserCount : ns.WeekLyNewUsersAndTenants[0].newUser,
        todayActiveTenants : todayActiveTenants,
        todayActiveUsers : todayActiveUsers,
        groupUsers : groupUsers,
        helpers : {
            addOne : function(index) {return index+1;}
        }
    };

    res.render('home', initData);
});



router.get('/business', function(req, res) {
    var weeklyActiveTenants = ns.WeeklyAvtiveTenants;
    var weeklyActiveUsers = ns.WeeklyActiveUsers;
    var weeklyNewUsersAndTenats = ns.WeekLyNewUsersAndTenants;

    console.log(weeklyActiveTenants.length);
    console.log(weeklyActiveUsers.length);

    var resMsg = [];

    for(var i=0; i<weeklyActiveTenants.length; i++) {
        var temp = {
            date : weeklyActiveTenants[i].name.replace(/\./g,'-'),
            activeTenantCount : weeklyActiveTenants[i].count,
            activeUserCount : weeklyActiveUsers[i].count,
            newUserCount : weeklyNewUsersAndTenats[i].newUser,
            newTenantCount : weeklyNewUsersAndTenats[i].newTenant,
            totalUserCount : weeklyNewUsersAndTenats[i].totalUsers,
            totalTenantCount : weeklyNewUsersAndTenats[i].totalTenants
        };

        resMsg.push(temp);
    }

    var resData = {
        todayActiveTenants : ns.WeeklyAvtiveTenants[0].tenantList,
        groupUsers : ns.GroupUsers,
        weeklyData : resMsg
    };

    res.status(200).send(resData);
});

router.get('/empty', function(req, res) {
    res.render('empty', {layout : false});
});

//router.get('/business', function(req, res) {
//    var path = req.query.path;
//    console.log(path);
//
//    baseService.getNewTenantAccount(path, function(result1) {
//        var resData = {newTenants:result1};
//        baseService.getActiveTenants(path, function(result2) {
//            resData.activeTenants = result2;
//            baseService.getActiveUsers(path, function(result3) {
//                resData.activeUsers = result3;
//                res.status(200).send(resData);
//            }, function(err3) {
//                res.status(500).send(err3);
//            });
//        }, function(err2) {
//            res.status(500).send(err2);
//        });
//    },function(err1) {
//        res.status(500).send(err1);
//    });
//});


module.exports = router;
