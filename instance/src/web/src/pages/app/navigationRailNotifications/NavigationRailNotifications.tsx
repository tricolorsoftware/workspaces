import { createEffect, createSignal, For, type Component } from "solid-js";
import trpc from "../../../lib/trpc";
import { type WorkspacesNotification } from "../../../../../subsystems/notifications";
import Nofification from "./notification/Notification";
import styles from "./NavigationRailNotifications.module.scss";
import UKIconButton from "@tcsw/uikit-solid/src/components/iconButton/UKIconButton.jsx";

const FLYOUT_NOTIFICATION_TIMEOUT = 10_000;

const NavigationRailNotifications: Component<{ expanded: boolean }> = (props) => {
    const [toggled, setToggled] = createSignal<boolean>(false);
    const [notifications, setNotifications] = createSignal<WorkspacesNotification[]>([]);
    const [flyoutNotifications, setFlyoutNotifications] = createSignal<WorkspacesNotification[]>([]);

    createEffect(() => {
        const subscription = trpc.app.notifications.listener.subscribe(undefined, {
            onData(data) {
                setFlyoutNotifications((not) => {
                    return [...not, data];
                });

                setNotifications((not) => {
                    return [...not, data];
                });

                // if not urgent, remove after FLYOUT_NOTIFICATION_TIMEOUT
                if (data.priority !== 2) {
                    setTimeout(() => {
                        setFlyoutNotifications((not) => not.filter((n) => n.uuid !== data.uuid));
                    }, FLYOUT_NOTIFICATION_TIMEOUT);
                }
            },
        });

        return () => {
            subscription.unsubscribe();
        };
    });

    return (
        <div class={styles.root} data-expanded={props.expanded}>
            <UKIconButton
                color={toggled() ? "filled" : "standard"}
                shape={toggled() ? "square" : "round"}
                icon={flyoutNotifications().length !== 0 ? "notifications_unread" : "notifications"}
                alt="notifications"
                onClick={() => {
                    setToggled((toggled) => !toggled);
                }}
            />
            <div class={styles.flyoutNotifications}>
                <For each={flyoutNotifications()}>{(notification) => <Nofification notification={notification} />}</For>
            </div>
            {toggled() && (
                <>
                    <div class={styles.notifications}>
                        <For each={notifications()}>{(notification) => <Nofification notification={notification} />}</For>
                        <Nofification
                            notification={{
                                recipient: 6,
                                sourceId: "instance.subsystems.applications",
                                priority: 1,
                                content: {
                                    title: "Restart Now?",
                                    icon: "warning",
                                    body: "Please restart the instance to disable any previously-enabled applications.",
                                },
                                uuid: "bleh",
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default NavigationRailNotifications;
