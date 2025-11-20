import { randomUUIDv7 } from "bun";
import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";
import EventEmitter from "node:events";

export enum WorkspacesNoticeType {
    Login,
    Signup,
}

export enum WorkspacesNotificationPriority {
    Normal,
    Important,
    Urgent,
}

export interface WorkspacesNotificationContent {
    title: string;
    icon?: string;
    body: string;
}

export enum WorkspacesNotificationEventEmitterEvent {
    SendNotification = "send_notification",
}

export interface WorkspacesNotification {
    recipient: number;
    sourceId: string;
    priority: WorkspacesNotificationPriority;
    content: WorkspacesNotificationContent;
    uuid: string;
}

export default class NotificationsSubsystem extends SubSystem {
    eventEmitter: EventEmitter;

    constructor(instance: Instance) {
        super("notifications", instance);

        this.eventEmitter = new EventEmitter();

        return this;
    }

    // TODO: implement this
    applyNotice(targetUserId: number, noticeType: WorkspacesNoticeType[], noticeTitle: string, noticeBody: string) {
        this.log.warning("Notices are Unimplemented");
        return this;
    }

    send(recipient: number, sourceId: string, priority: WorkspacesNotificationPriority, content: WorkspacesNotificationContent) {
        // TODO: send a notification

        this.eventEmitter.emit(WorkspacesNotificationEventEmitterEvent.SendNotification, {
            recipient,
            sourceId,
            priority,
            content,
            uuid: randomUUIDv7(),
        } satisfies WorkspacesNotification);

        return this;
    }
}
