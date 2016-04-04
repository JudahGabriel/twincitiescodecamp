namespace Tccc.Server {
    export interface Event {
        id: string;
        registerUrl: string;
        dateTime: string;
        locationFriendlyName: string;
        address: string;
        number: number;
    }

    export interface Talk {
        id: string;
        title: string;
        abstract: string;
        author: string;
        authorBio: string;
        authorTwitter: string;
        room: string;
        hour: number;
        eventId: string;
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
}