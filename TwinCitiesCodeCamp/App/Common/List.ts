namespace Tccc {

    /**
     * A list that fetches its items asynchronously. Provides optional caching via local storage.
     */
    export class List<T> {
        items: T[] = [];
        hasLoaded = false;
        isLoading = false;
        noItemsText = "There are no results";

        constructor(private fetcher: () => ng.IPromise<T[]>, private readonly cacheKey?: string) {
            if (cacheKey) {
                this.rehydrateCachedItems(cacheKey);
            }
        }

        reset() {
            this.items.length = 0;
            this.isLoading = false;
        }

        resetAndFetch() {
            this.reset();
            this.fetch();
        }

        fetch(): ng.IPromise<T[]> | null {
            if (!this.isLoading) {
                this.isLoading = true;
                this.hasLoaded = false;
                var task = this.fetcher();
                task
                    .then(results => {
                        if (this.isLoading) {
                            this.items = results;
                            if (this.cacheKey) {
                                setTimeout(() => this.cacheItems(this.cacheKey!, results), 0);
                            }
                        }
                        this.hasLoaded = true;
                    })
                    .finally(() => this.isLoading = false);
                return task;
            }

            return null;
        }

        remove(item: T): boolean {
            var lengthBeforeRemoval = this.items.length;
            var arrayAfterRemoval = _.pull(this.items, item);
            return lengthBeforeRemoval > arrayAfterRemoval.length;
        }

        private rehydrateCachedItems(cacheKey: string) {
            try {
                var cachedJson = window.localStorage.getItem(cacheKey);
                if (cachedJson) {
                    this.items = JSON.parse(cachedJson);
                }
            } catch (error) {
                console.log("Failed to rehydrated cached items for cacheKey", cacheKey, error);
            }
        }

        private cacheItems(cacheKey: string, items: T[]) {
            try {
                var itemsJson = JSON.stringify(items);
                window.localStorage.setItem(cacheKey, itemsJson);
            } catch (error) {
                console.log("Unable to cache list of items with cache key", cacheKey, items, error);
            }
        }

        get isLoadedWithData(): boolean {
            return this.hasLoaded && !this.isLoading && this.itemsTotalCount > 0;
        }

        get isLoadedAndEmpty(): boolean {
            return this.itemsTotalCount === 0 && !this.isLoading;
        }

        get itemsTotalCount(): number {
            return this.items.length;
        }
    }
}