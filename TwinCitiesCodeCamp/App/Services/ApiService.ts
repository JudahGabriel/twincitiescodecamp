namespace Tccc {
    export class ApiService {
        resultsInProgress = 0;
        isShowingApiError = false;
        apiBaseUrl = "/api";

        static $inject = ["loadingProgress", "$http", "$q"];

        constructor(
            private loadingProgress: LoadingProgressService,
            private $http: ng.IHttpService,
            private $q: ng.IQService) {
        }

        /**
         * Performs an AJAX GET request.
         * @params 
         */
        query<T>(relativeUrl: string, args: any = null, selector: (rawResult: any) => T = null, showProgress = true): ng.IPromise<T> {
            var progress: ng.IDeferred<T>;
            if (showProgress) {
                progress = this.loadingProgress.start<T>();
            } else {
                progress = this.$q.defer<T>();
            }
            
            var config: ng.IRequestConfig = {
                url: this.apiBaseUrl + relativeUrl,
                method: "GET",
                params: args
            };

            this.$http(config)
                .then(result => {
                    var preppedResult: T = selector ? selector(result.data) : <T>result.data;
                    progress.resolve(preppedResult);
                }, failed => {
                    progress.reject(failed);
                    this.onAjaxError(failed, `Error loading ${relativeUrl}.`);
                });

            return progress.promise;
        }

        post<T>(relativeUrl: string, args: any, selector: (rawResult: any) => T = null, showProgress = true): ng.IPromise<T> {
            var deferred: ng.IDeferred<T>;
            if (showProgress) {
                deferred = this.loadingProgress.start<T>();
            } else {
                deferred = this.$q.defer<T>();
            }
            
            var absoluteUrl = `${this.apiBaseUrl}${relativeUrl}`;
            var postTask = this.$http.post(absoluteUrl, args);
            postTask.then((result: any) => {
                var preppedResult = selector ? selector(result.data) : result.data;
                deferred.resolve(preppedResult);
            });
            postTask.catch(error => {
                this.showApiError(`Error saving ${relativeUrl}.`);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        private onAjaxError(errorDetails: any, errorMessage: string) {
            this.showApiError(errorMessage);
        }

        private showApiError(errorMessage: string) {
            //if (!this.isShowingApiError) {
            //    this.isShowingApiError = true;
            //    this.appNav.messageBox("Error", errorMessage, ["Dismiss"], "Dismiss")
            //        .result.finally(() => this.isShowingApiError = false);
            //}
        }
    }

    App.service("apiService", ApiService);
}