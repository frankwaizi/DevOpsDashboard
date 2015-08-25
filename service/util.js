var Util = function() {

};

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//递减
Util.prototype.getLast7Days = function(date1) {
    var addDay = 24*60*60*1000;

    var date2 = formatDate(Date.parse(date1)-addDay),
    date3 = formatDate(Date.parse(date2)-addDay),
    date4 = formatDate(Date.parse(date3)-addDay),
    date5 = formatDate(Date.parse(date4)-addDay),
    date6 = formatDate(Date.parse(date5)-addDay),
    date7 = formatDate(Date.parse(date6)-addDay),
    date8 = formatDate(Date.parse(date7)-addDay);

    var  dates = [date1, date2, date3, date4, date5, date6, date7, date8];

    return dates;
};

//ms to date "yy.mm.dd"Date
var formatDate = function(time) {
    //var newDate = new Date(time).toLocaleDateString().split('/');
    //for(var i=0; i<newDate.length; i++) {
    //    if(parseInt(newDate[i]) < 10) {
    //         newDate[i] = '0'+newDate[i];
    //    }
    //}
    //
    //return newDate[0]+'.'+newDate[1]+'.'+newDate[2];
    return new Date(time).Format("yyyy.MM.dd");
};

module.exports = new Util();