var Tccc;
(function (Tccc) {
    /**
     * Service that allows you to create deferred objects that show loading UI.
     * When the loading is completed, if no other load operations are occurring,  the loading UI will be hidden.
     */
    var LoadingProgressService = (function () {
        function LoadingProgressService($q) {
            this.$q = $q;
            this.resultsInProgress = 0;
        }
        /**
         * Creates a deferred object and shows the loading UI until the deferred work completes.
         */
        LoadingProgressService.prototype.start = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.loadingStarted();
            deferred.promise.finally(function () { return _this.loadingEnded(); });
            return deferred;
        };
        LoadingProgressService.prototype.loadingStarted = function () {
            this.resultsInProgress++;
            if (this.resultsInProgress === 1) {
                NProgress.start();
            }
        };
        LoadingProgressService.prototype.loadingEnded = function () {
            this.resultsInProgress--;
            if (this.resultsInProgress === 0) {
                NProgress.done();
            }
        };
        return LoadingProgressService;
    }());
    LoadingProgressService.$inject = ["$q"];
    Tccc.LoadingProgressService = LoadingProgressService;
    Tccc.App.service("loadingProgress", LoadingProgressService);
})(Tccc || (Tccc = {}));
