import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.jsx";
import type { Component } from "solid-js";
import styles from "./NavigationRailAvatar.module.scss";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.jsx";

const NavigationRailAvatar: Component<{ expanded: boolean }> = (props) => {
    return (
        <div class={styles.root} data-expanded={props.expanded}>
            <UKAvatar class={styles.avatar} avatar={"/assets/placeholder/avatar.png"} size="s" username="[PUT SIDEBAR HERE]" />
            <div class={styles.nameContainer}>
                <UKText size="m" role="title" class={styles.displayName}>
                    Display Name
                </UKText>
                <UKText size="m" role="label" class={styles.username}>
                    {"@"}Username
                </UKText>
            </div>
        </div>
    );
};

export default NavigationRailAvatar;
