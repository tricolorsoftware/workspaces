import UKAvatar from "@tcsw/uikit-solid/src/components/avatar/UKAvatar.jsx";
import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";
import styles from "./Widget.module.scss";

const Widget: Component = () => {
    return (
        <UKCard class={styles.root}>
            <UKAvatar avatar="/assets/placeholder/avatar.png" size="m" username="username" />
            <div>
                <UKText role="title" align="start" emphasized size="l">
                    Full Name
                </UKText>
                <UKText role="label" align="start" size="s">
                    @Username
                </UKText>
            </div>
        </UKCard>
    );
};

export default Widget;
