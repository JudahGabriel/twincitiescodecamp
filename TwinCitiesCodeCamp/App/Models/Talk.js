var Tccc;
(function (Tccc) {
    var Talk = (function () {
        function Talk(serverObj) {
            angular.copy(serverObj, this);
        }
        Object.defineProperty(Talk.prototype, "pictureUrlOrDefault", {
            get: function () {
                return this.pictureUrl || "../Content/Images/unknown-speaker.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Talk.prototype, "timeFriendly", {
            get: function () {
                if (this.hour) {
                    return moment()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .add(this.hour, "hours")
                        .format("h:mm a");
                }
                return "";
            },
            enumerable: true,
            configurable: true
        });
        return Talk;
    }());
    Tccc.Talk = Talk;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Talk.js.map