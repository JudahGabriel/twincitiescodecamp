namespace Tccc {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ngSanitize",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "LocalStorageModule"
    ];

    export var App = angular.module("TcccApp", modules);
    
    App.config(["$routeProvider", "$locationProvider", function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
        $routeProvider.caseInsensitiveMatch = true;
        $locationProvider.hashPrefix('');
        $routeProvider
            .when("/home", { templateUrl: "/App/Views/Home.html" })
            .when("/event", { templateUrl: "/App/Views/Event.html" })
            .when("/schedule", { templateUrl: "/App/Views/Schedule.html" })
            .when("/schedule/printable", { templateUrl: "/App/Views/PrintableSchedule.html" })
            .when("/events/:eventId/talks", { templateUrl: "/App/Views/Talks.html" })
            .when("/speakers", { templateUrl: "/App/Views/Speakers.html" })
            .when("/sponsors", { templateUrl: "/App/Views/Sponsors.html" })
            .when("/sponsorship", { templateUrl: "/App/Views/SponsorshipOpportunity.html" })
            .when("/sponsors/paypal", { redirectTo: "/sponsorship" })
            .when("/sponsor/success", { templateUrl: "/App/Views/SponsorSuccess.html" })
            .when("/sponsor/cancel", { templateUrl: "/App/Views/SponsorCancel.html" })
            .when("/pastevents", { templateUrl: "/App/Views/PastEvents.html" })
            .when("/about", { templateUrl: "/App/Views/AboutUs.html" })
            .when("/talks/mine", { templateUrl: "/App/Views/MyTalks.html" })
            .when("/talks/:id", { templateUrl: "/App/Views/TalkProfile.html" })
            .when("/policies", { templateUrl: "/App/Views/Policies.html" })
            .when("/register/notopened", { templateUrl: "/App/Views/RegistrationNotOpened.html" }) // use this as the registration link when the event isn't opened for registration
            //.when("/callforspeakers", { templateUrl: "/App/Views/CallForSpeakers.html" })
            .when("/callforspeakers", { templateUrl: "/App/Views/SubmitTalk.html" })

            .when("/admin", { redirectTo: "/admin/events" })
            .when("/admin/events", { templateUrl: "/App/Views/AdminEvents.html" })
            .when("/admin/events/:eventNumber/talks", { templateUrl: "/App/Views/AdminTalks.html" })
            .when("/admin/events/:eventNumber/sponsors", { templateUrl: "/App/Views/AdminSponsors.html" })
            .when("/admin/events/:eventNumber/schedule", { templateUrl: "/App/Views/AdminSchedules.html" })
            .otherwise({ redirectTo: "/home" });
    }]);

    // Store the partials and modals as constants. These values will be cache-busted by the build. See AngularViewCacheBuster.cs
    var partials = {
        header: "/App/Views/Header.html",
        adminNav: "/App/Views/AdminNav.html"
    };
    App.constant("partials", partials);
    export var Partials = partials; // Needed for component registration

    // Store some initialization config passedin from Razor as Angular constants for use in our controllers.
    var homeViewModel = window["Tccc.HomeViewModel"] as Server.HomeViewModel | null;
    if (homeViewModel) {
        App.constant("currentUserName", homeViewModel.userName);
        App.constant("currentUserId", homeViewModel.userId);
        App.constant("isSignedIn", homeViewModel.isSignedIn);
        App.constant("isUserAdmin", homeViewModel.isUserAdmin);
    }

    App.run([
        "partials",
        "isUserAdmin",
        "$location",
        "$rootScope",
        function (partials: any, isUserAdmin: boolean, $location: ng.ILocationService, $rootScope: ng.IRootScopeService) {
            $rootScope["Partials"] = partials;

            const adminRoute = "/admin";
            $rootScope.$on("$routeChangeStart", (_e: ng.IAngularEvent, next: any) => {
                const path = ($location.path() || "").toLowerCase();
                const route: ng.route.IRoute | null = next["$$route"];
                
                // If we're not signed in, we can only access anonymous paths.
                if (route && path.includes(adminRoute)) {
                    if (!isUserAdmin) {
                        window.location.href = "/account/login";
                    }
                }
            });
        }]);
    
    function goLlamas() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => window["jwerty"].key("↑,↑,↓,↓,←,→,←,→,B,A,↩", () => window.location.href = "https://www.youtube.com/watch?v=bHNczNvOnGc");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    goLlamas();

    // Setup Fastclick to remove the 300ms click delay on mobile browsers.
    document.addEventListener("DOMContentLoaded", () => FastClick.attach(document.body), false);
}