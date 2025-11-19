import type { Instance } from "../index.js";
import SubSystem from "../subSystems.js";

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

export default class NotificationsSubsystem extends SubSystem {
    constructor(instance: Instance) {
        super("notifications", instance);

        return this;
    }

    // TODO: implement this
    applyNotice(targetUserId: number, noticeType: WorkspacesNoticeType[], noticeTitle: string, noticeBody: string) {
        this.log.warning("Notices are Unimplemented");
        return this;
    }

    send(recipient: string, sourceId: string, priority: WorkspacesNotificationPriority, content: WorkspacesNotificationContent) {
        // TODO: send a notification

        return this;
    }
}
