var Tccc;
(function (Tccc) {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ui.bootstrap",
        "ui.bootstrap.tpls"
    ];
    Tccc.App = angular.module("TcccApp", modules);
    Tccc.App.config(["$routeProvider", function ($routeProvider) {
            $routeProvider
                .when("/home", { templateUrl: "/App/Views/Home.html" })
                .otherwise({ redirectTo: "/home" });
        }]);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=App.js.map