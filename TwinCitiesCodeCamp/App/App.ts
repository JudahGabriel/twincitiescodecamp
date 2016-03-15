namespace Tccc {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ui.bootstrap",
        "ui.bootstrap.tpls"
    ];

    export var App = angular.module("TcccApp", modules);

    App.config(["$routeProvider", function ($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when("/home", { templateUrl: "/App/Views/Home.html" })
            .otherwise({ redirectTo: "/home" });
    }]);
    
    //App.run(["$rootScope", function ($rootScope: ng.IRootScopeService) { }]);
}