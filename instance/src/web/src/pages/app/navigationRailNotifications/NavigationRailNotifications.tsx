import { createEffect, createSignal, For, type Component } from "solid-js";
import trpc from "../../../lib/trpc";
import type { WorkspacesNotification } from "../../../../../subsystems/notifications";
import Nofification from "./notification/Notification";
import styles from "./NavigationRailNotifications.module.scss";
import UKIconButton from "@tcsw/uikit-solid/src/components/iconButton/UKIconButton.jsx";

const NavigationRailNotifications: Component<{ expanded: boolean }> = (props) => {
    const [notifications, setNotifications] = createSignal<WorkspacesNotification[]>([]);

    createEffect(() => {
        const subscription = trpc.app.notifications.listener.subscribe(undefined, {
            onData(data) {
                setNotifications((not) => {
                    return [...not, data];
                });

                setTimeout(() => {
                    setNotifications((not) => not.filter((n) => n.uuid !== data.uuid));
                }, 5000);
            },
        });

        return () => {
            subscription.unsubscribe();
        };
    });

    return (
        <div class={styles.root}>
            <UKIconButton
                icon={notifications().length !== 0 ? "notifications_unread" : "notifications"}
                alt="notifications"
                onClick={() => 0}
            />
            <div class={styles.notifications} data-expanded={props.expanded}>
                <For each={notifications()}>{(notification) => <Nofification notification={notification} />}</For>
            </div>
        </div>
    );
};

export default NavigationRailNotifications;
