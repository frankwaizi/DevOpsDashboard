define(function() {
    var init = function() {
        $('#chartlink, #chartlink2').click(function() {
            $('#table').hide('slow');
             $('#chart').show('slow');
            });

        $('#tablelink,#activeTenantBox, #activeUserBox').click(function() {
            $('#chart').hide('slow');
            $('#table').show('slow');
        });

        //Make the dashboard widgets sortable Using jquery UI
        $(".connectedSortable").sortable({
            placeholder: "sort-highlight",
            connectWith: ".connectedSortable",
            handle: ".box-header, .nav-tabs",
            forcePlaceholderSize: true,
            zIndex: 999999
        }).disableSelection();
        $(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor", "move");

        $('#activeTenantList').dataTable();
        $('#activeCompanyList').dataTable();
        $('#activeUserList').dataTable();
    }

    var getData = function(callback) {
        $.ajax({
            type : 'GET',
            url : '/business',
            //data : {path: "2015-03-12"},
            cache : true
        }).done(function(resData) {
            callback(resData);
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.readyState == 4) {
                alert('ajax error:%s', textStatus);
            } else
                alert('error:' + textStatus);
        });
    }

    var renderList = function(data) {
        var activeUsers = data.activeUsers.users;
        var activeTenants = data.activeTenants;
        /**
         * render list
         */
        var headerData = ['#', 'ID', 'Company', 'User', 'Email', 'Phone', 'LastLogin', 'UserCreate', 'KeyUser'];
        var headerKey = ['customerId', 'customerName', 'name', 'email', 'phone', 'lastLoginDate', 'userCreateDate', 'isKeyUser'];

        var header = "<tr>";
        for(var t in headerData) {
            header += "<th>"+headerData[t]+"</th>";
        }
        header += "</tr>";

        var body = "";
        var count = 1;
        for(var user in activeUsers) {
            var temp = "<tr><td>"+ count + "</td>";
            for(var key=0; key<headerKey.length; key++) {
                if(key == headerKey.length-1){
                    if(activeUsers[user][headerKey[key]] == "1") {
                        temp += "<td><span class='label label-success'>Yes</span></td>";
                    }else {
                        temp += "<td><span class='label label-danger'>No</span></td>";
                    }
                }else {
                    temp += "<td>" + activeUsers[user][headerKey[key]] + "</td>";
                }
            }
            count++;
            body += temp;
        }

        $("#activeUserList").html(header+body);
        $("#activeTenant").text(activeTenants.length);
        $("#activeUser").text(activeUsers.length);
    }

    var renderChart = function(data) {
        //The Calender
        //$("#calendar").datepicker();

        var todayActiveTenants = data.todayActiveTenants;
        var groupUsers = data.groupUsers;
        var weeklyData = data.weeklyData;
        /**
         * render chart
         */
        //bar chart data
        var barData = [];
        //line chart data
        var lineData = [];
        //bar chart data
        var newBarData = [];
        //line chart data
        var newLineData = [];
        //bar chart data
        var totalBarData = [];
        //line chart data
        var totalLineData = [];

        //donut chart data
        var tenantDonutData = [];
        var userDonutData = [];


        //for bar chart and line chart
        for(var i=weeklyData.length; i > 0; i--) {
            var temp1 = {date: weeklyData[i-1].date, a: weeklyData[i-1].activeTenantCount, b: weeklyData[i-1].activeUserCount};
            var temp2 = {date: weeklyData[i-1].date, a: weeklyData[i-1].newTenantCount, b: weeklyData[i-1].newUserCount};
            var temp3 = {date: weeklyData[i-1].date, a: weeklyData[i-1].totalTenantCount, b: weeklyData[i-1].totalUserCount};


            barData.push(temp1);

            lineData.push(temp1);

            newBarData.push(temp2);

            newLineData.push(temp2);

            totalBarData.push(temp3);

            totalLineData.push(temp3);
        }
        //for donut chart
        for(var j=0; j<todayActiveTenants.length; j++) {
            var temp = {label: todayActiveTenants[j].tenantId, value: todayActiveTenants[j].count};
            if(temp.label){
                tenantDonutData.push(temp);
            }
        }

        //for donut chart2
        for(var k=0; k<groupUsers.length; k++) {
            var temp = {label: groupUsers[k].name, value: groupUsers[k].count};
            if(temp.label){
                userDonutData.push(temp);
            }
        }

        //bar chart
        var bar = new Morris.Bar({
            element: 'bar-chart',
            resize: true,
            data: barData,
            barColors: ['#00a65a', '#f56954'],
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['活跃Tenant', '活跃用户'],
            hideHover: 'auto'
        });

        //line chart
        var line = new Morris.Line({
            element: 'line-chart',
            resize: true,
            data: lineData,
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['活跃Tenant', '活跃用户'],
            xLabels : "day",
            lineColors: ['#00a65a', '#f56954'],
            hideHover: 'auto'
        });

        //bar chart
        var newBar = new Morris.Bar({
            element: 'weeklynew-bar-chart',
            resize: true,
            data: newBarData,
            barColors: ['#00a65a', '#f56954'],
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['新增Tenant', '新增用户'],
            hideHover: 'auto'
        });

        //line chart
        var newLine = new Morris.Line({
            element: 'weeklynew-line-chart',
            resize: true,
            data: newLineData,
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['新增Tenant', '新增用户'],
            xLabels : "day",
            lineColors: ['#00a65a', '#f56954'],
            hideHover: 'auto'
        });

        //bar chart
        var totalBar = new Morris.Bar({
            element: 'weeklytotal-bar-chart',
            resize: true,
            data: totalBarData,
            barColors: ['#00a65a', '#3c8dbc'],
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['Tenant总数', '用户总数'],
            hideHover: 'auto'
        });

        //line chart
        var totalLine = new Morris.Area({
            element: 'weeklytotal-line-chart',
            resize: true,
            data: totalLineData,
            xkey: 'date',
            ykeys: ['a', 'b'],
            labels: ['Tenant总数', '用户总数'],
            xLabels : "day",
            lineColors: ['#00a65a', '#3c8dbc'],
            hideHover: 'auto'
        });
        //
        //donut chart
        var tenantDonut = new Morris.Donut({
            element: 'tenant-donutchart',
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a"],
            data: tenantDonutData,
            hideHover: 'auto'
        });

        var userDonut = new Morris.Donut({
            element: 'user-donutchart',
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a"],
            data: userDonutData,
            hideHover: 'auto'
        });

    }

    return {
        init : init,
        getData : getData,
        renderList : renderList,
        renderChart : renderChart
    };
});