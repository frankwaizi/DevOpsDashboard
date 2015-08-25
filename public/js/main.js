require.config({
    baseUrl: 'js',
    paths: {
        dashboard: 'app/dashboard'
    }
});

require(['dashboard'], function(dashboard) {
    dashboard.init();
    dashboard.getData(function(data) {
        //dashboard.renderList(data);
        dashboard.renderChart(data);
    });
});