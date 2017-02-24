namespace Tccc {
    export class EventService {

        static $inject = [
            "apiService",
            "localStorageService",
            "$q"
        ];
        private static readonly mostRecentEventCacheKey = "mostRecentEvent";

        constructor(
            private apiService: ApiService,
            private localStorageService: ng.local.storage.ILocalStorageService,
            private $q: ng.IQService) {
        }

        getMostRecentEvent(): ng.IPromise<Event> {
            var selector = (e: Server.Event) => new Event(e);
            var deferred = this.$q.defer<Event>();

            // See if we have the most recent event cache.
            var cachedMostRecentEvent = this.localStorageService.get<Server.Event>(EventService.mostRecentEventCacheKey);
            if (cachedMostRecentEvent) {
                deferred.notify(new Event(cachedMostRecentEvent));
            }

            // Fetch the most recent 
            this.apiService.query("/events/mostrecent", null, selector)
                .then(result => {
                    deferred.resolve(result);
                    this.localStorageService.set(EventService.mostRecentEventCacheKey, result);
                })
                .catch(error => deferred.reject(error));
            
            return deferred.promise;
        }

        getEvent(eventId: string): ng.IPromise<Event> {
            var args = { eventId: eventId };
            var selector = (e: Server.Event) => new Event(e);
            return this.apiService.query("/events/get", args, selector);
        }

        getAll(): ng.IPromise<Event[]> {
            var selector = (events: Server.Event[]) => events.map(e => new Event(e));
            return this.apiService.query("/events/getall", null, selector);
        }
    }

    App.service("eventApi", EventService);
}