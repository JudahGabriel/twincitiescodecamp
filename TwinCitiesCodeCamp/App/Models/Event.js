var Tccc;
(function (Tccc) {
    var Event = (function () {
        function Event(serverObj) {
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
        return Event;
    }());
    Tccc.Event = Event;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Event.js.map