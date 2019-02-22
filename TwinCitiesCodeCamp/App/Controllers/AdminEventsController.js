var Tccc;
(function (Tccc) {
    var AdminEventsController = /** @class */ (function () {
        function AdminEventsController(eventApi) {
            this.eventApi = eventApi;
            this.selectedEvent = null;
            this.events = [];
            this.jsDates = {};
        }
        Object.defineProperty(AdminEventsController.prototype, "noTalksSubmissionsAfterDate", {
            get: function () {
                if (!this.selectedEvent || !this.selectedEvent.noTalkSubmissionsAfter) {
                    return null;
                }
                var existingJsDate = this.jsDates[this.selectedEvent.noTalkSubmissionsAfter];
                if (!existingJsDate) {
                    existingJsDate = new Date(this.selectedEvent.noTalkSubmissionsAfter);
                    this.jsDates[this.selectedEvent.noTalkSubmissionsAfter] = existingJsDate;
                }
                return existingJsDate;
            },
            set: function (val) {
                if (this.selectedEvent) {
                    this.selectedEvent.noTalkSubmissionsAfter = val ? val.toISOString() : null;
                }
            },
            enumerable: true,
            configurable: true
        });
        AdminEventsController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getAll(true)
                .then(function (results) {
                _this.events = results;
                _this.selectedEvent = _this.events[0];
            });
        };
        AdminEventsController.prototype.addEvent = function () {
            var event;
            if (this.selectedEvent) {
                event = new Tccc.Event({
                    address: this.selectedEvent.address,
                    dateTime: new Date().toISOString(),
                    id: "",
                    isAcceptingTalkSubmissions: false,
                    locationFriendlyName: this.selectedEvent.locationFriendlyName,
                    number: this.selectedEvent.number + 1,
                    registerUrl: "",
                    seasonYear: "",
                    noTalkSubmissionsAfter: this.selectedEvent.noTalkSubmissionsAfter
                });
            }
            else {
                event = new Tccc.Event({
                    address: "",
                    dateTime: new Date().toISOString(),
                    id: "",
                    isAcceptingTalkSubmissions: false,
                    locationFriendlyName: "",
                    number: 0,
                    registerUrl: "",
                    seasonYear: "",
                    noTalkSubmissionsAfter: null
                });
            }
            this.events.unshift(event);
            this.selectedEvent = event;
        };
        AdminEventsController.prototype.save = function () {
            var ev = this.selectedEvent;
            if (ev && !ev.isSaving) {
                ev.isSaving = true;
                this.eventApi.save(ev)
                    .finally(function () { return ev.isSaving = false; });
            }
        };
        AdminEventsController.$inject = [
            "eventApi"
        ];
        return AdminEventsController;
    }());
    Tccc.AdminEventsController = AdminEventsController;
    Tccc.App.controller("AdminEventsController", AdminEventsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminEventsController.js.map