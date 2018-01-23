var Tccc;
(function (Tccc) {
    var Event = /** @class */ (function () {
        function Event(serverObj) {
            this.lastRawDate = null;
            this.isSaving = false;
            if (serverObj) {
                angular.copy(serverObj, this);
            }
        }
        Object.defineProperty(Event.prototype, "friendlyDate", {
            get: function () {
                return moment(this.dateTime).format("MMMM D, YYYY h:mm A");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "rawDate", {
            // raw date for binding Date objects in Angular to HTML5 date input.
            get: function () {
                if (!this.lastRawDate && this.dateTime) {
                    this.lastRawDate = moment(this.dateTime).toDate();
                }
                return this.lastRawDate;
            },
            set: function (val) {
                if (val) {
                    this.dateTime = val.toISOString();
                    this.lastRawDate = val;
                }
                else {
                    this.lastRawDate = new Date();
                    this.dateTime = this.lastRawDate.toISOString();
                }
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    }());
    Tccc.Event = Event;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Event.js.map