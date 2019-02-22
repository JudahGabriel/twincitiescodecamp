namespace Tccc.Server {
    export interface HomeViewModel {
        isSignedIn: boolean;
        userName: string;
        userId: string;
        isUserAdmin: boolean;
    }

    export interface Event {
        id: string;
        registerUrl: string;
        dateTime: string;
        locationFriendlyName: string;
        address: string;
        number: number;
        seasonYear: string;
        isAcceptingTalkSubmissions: boolean;
        noTalkSubmissionsAfter: string | null;
    }

    export interface Talk {
        id: string | null;
        title: string;
        abstract: string;
        author: string;
        authorBio: string;
        authorTwitter: string | null;
        authorGitHub: string | null;
        room: string | null;
        hour: number;
        eventId: string;
        pictureUrl: string;
        tags: string[];
        submissionDate: string;
        submittedByUserId: string;
        status: TalkApproval;
    }

    export interface ScheduleTimeslot {
        start: number;
        duration: number;
        items: ScheduleItem[];
    }

    export interface ScheduleItem {
        title: string;
        talkId: string;
        room: string;
        author: string;
    }

    export interface Schedule {
        id: string;
        eventId: string;
        timeslots: ScheduleTimeslot[];
    }

    export interface Sponsor {
        id: string | null;
        eventId: string;
        name: string;
        about: string;
        logo: string;
        url: string;
        twitter: string;
        level: SponsorshipLevel;
        createDate: string;
    }
}