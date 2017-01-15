var Tccc;
(function (Tccc) {
    var ApiService = (function () {
        function ApiService(loadingProgress, $http, $q) {
            this.loadingProgress = loadingProgress;
            this.$http = $http;
            this.$q = $q;
            this.resultsInProgress = 0;
            this.isShowingApiError = false;
            this.apiBaseUrl = "/api";
        }
        /**
         * Performs an AJAX GET request.
         * @params
         */
        ApiService.prototype.query = function (relativeUrl, args, selector, showProgress) {
            var _this = this;
            if (args === void 0) { args = null; }
            if (selector === void 0) { selector = null; }
            if (showProgress === void 0) { showProgress = true; }
            var progress;
            if (showProgress) {
                progress = this.loadingProgress.start();
            }
            else {
                progress = this.$q.defer();
            }
            var config = {
                url: this.apiBaseUrl + relativeUrl,
                method: "GET",
                params: args
            };
            this.$http(config)
                .then(function (result) {
                var preppedResult = selector ? selector(result.data) : result.data;
                progress.resolve(preppedResult);
            }, function (failed) {
                progress.reject(failed);
                _this.onAjaxError(failed, "Error loading " + relativeUrl + ".");
            });
            return progress.promise;
        };
        ApiService.prototype.post = function (relativeUrl, args, selector, showProgress) {
            var _this = this;
            if (selector === void 0) { selector = null; }
            if (showProgress === void 0) { showProgress = true; }
            var deferred;
            if (showProgress) {
                deferred = this.loadingProgress.start();
            }
            else {
                deferred = this.$q.defer();
            }
            var absoluteUrl = "" + this.apiBaseUrl + relativeUrl;
            var postTask = this.$http.post(absoluteUrl, args);
            postTask.then(function (result) {
                var preppedResult = selector ? selector(result.data) : result.data;
                deferred.resolve(preppedResult);
            });
            postTask.catch(function (error) {
                _this.showApiError("Error saving " + relativeUrl + ".");
                deferred.reject(error);
            });
            return deferred.promise;
        };
        ApiService.prototype.onAjaxError = function (errorDetails, errorMessage) {
            this.showApiError(errorMessage);
        };
        ApiService.prototype.showApiError = function (errorMessage) {
            //if (!this.isShowingApiError) {
            //    this.isShowingApiError = true;
            //    this.appNav.messageBox("Error", errorMessage, ["Dismiss"], "Dismiss")
            //        .result.finally(() => this.isShowingApiError = false);
            //}
        };
        return ApiService;
    }());
    ApiService.$inject = ["loadingProgress", "$http", "$q"];
    Tccc.ApiService = ApiService;
    Tccc.App.service("apiService", ApiService);
})(Tccc || (Tccc = {}));
