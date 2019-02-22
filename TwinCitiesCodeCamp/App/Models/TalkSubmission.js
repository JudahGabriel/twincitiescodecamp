var Tccc;
(function (Tccc) {
    var TalkSubmission = /** @class */ (function () {
        function TalkSubmission(dto) {
            angular.copy(dto, this);
        }
        Object.defineProperty(TalkSubmission.prototype, "pictureUrlOrDefault", {
            get: function () {
                return "/files/getTalkProfileImage?talkId=" + this.id || "../Content/Images/unknown-speaker.jpg";
            },
            enumerable: true,
            configurable: true
        });
        return TalkSubmission;
    }());
    Tccc.TalkSubmission = TalkSubmission;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkSubmission.js.map