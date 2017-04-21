var Tccc;
(function (Tccc) {
    /**
     * A list that fetches its items asynchronously. Provides optional caching via local storage.
     */
    var List = (function () {
        function List(fetcher, cacheKey) {
            this.fetcher = fetcher;
            this.cacheKey = cacheKey;
            this.items = [];
            this.hasLoaded = false;
            this.isLoading = false;
            this.noItemsText = "There are no results";
            if (cacheKey) {
                this.rehydrateCachedItems(cacheKey);
            }
        }
        List.prototype.reset = function () {
            this.items.length = 0;
            this.isLoading = false;
        };
        List.prototype.resetAndFetch = function () {
            this.reset();
            this.fetch();
        };
        List.prototype.fetch = function () {
            var _this = this;
            if (!this.isLoading) {
                this.isLoading = true;
                this.hasLoaded = false;
                var task = this.fetcher();
                task
                    .then(function (results) {
                    if (_this.isLoading) {
                        _this.items = results;
                        if (_this.cacheKey) {
                            setTimeout(function () { return _this.cacheItems(_this.cacheKey, results); }, 0);
                        }
                    }
                    _this.hasLoaded = true;
                })
                    .finally(function () { return _this.isLoading = false; });
                return task;
            }
            return null;
        };
        List.prototype.remove = function (item) {
            var lengthBeforeRemoval = this.items.length;
            var arrayAfterRemoval = _.pull(this.items, item);
            return lengthBeforeRemoval > arrayAfterRemoval.length;
        };
        List.prototype.rehydrateCachedItems = function (cacheKey) {
            try {
                var cachedJson = window.localStorage.getItem(cacheKey);
                if (cachedJson) {
                    this.items = JSON.parse(cachedJson);
                }
            }
            catch (error) {
                console.log("Failed to rehydrated cached items for cacheKey", cacheKey, error);
            }
        };
        List.prototype.cacheItems = function (cacheKey, items) {
            try {
                var itemsJson = JSON.stringify(items);
                window.localStorage.setItem(cacheKey, itemsJson);
            }
            catch (error) {
                console.log("Unable to cache list of items with cache key", cacheKey, items, error);
            }
        };
        Object.defineProperty(List.prototype, "isLoadedWithData", {
            get: function () {
                return this.hasLoaded && !this.isLoading && this.itemsTotalCount > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "isLoadedAndEmpty", {
            get: function () {
                return this.itemsTotalCount === 0 && !this.isLoading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "itemsTotalCount", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        return List;
    }());
    Tccc.List = List;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=List.js.map