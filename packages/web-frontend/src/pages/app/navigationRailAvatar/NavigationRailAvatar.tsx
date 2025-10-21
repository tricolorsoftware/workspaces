import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.jsx";
import { createResource, type Component } from "solid-js";
import styles from "./NavigationRailAvatar.module.scss";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.jsx";
import trpc from "../../../lib/trpc";

const NavigationRailAvatar: Component<{ expanded: boolean }> = (props) => {
    const [user] = createResource(() => trpc.app.navigation.user.name.query());

    if (user()) {
        return null;
    }

    return (
        <div class={styles.root} data-expanded={props.expanded}>
            <UKAvatar class={styles.avatar} avatar={"/assets/placeholder/avatar.png"} size="s" username="[PUT SIDEBAR HERE]" />
            <div class={styles.nameContainer}>
                <UKText size="m" role="title" class={styles.displayName}>
                    {`${user.forename} ${user.surname}`}
                </UKText>
                <UKText size="m" role="label" class={styles.username}>
                    {`@${user.username}`}
                </UKText>
            </div>
        </div>
    );
};

export default NavigationRailAvatar;
