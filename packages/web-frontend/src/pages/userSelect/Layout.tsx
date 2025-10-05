import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.jsx";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";
import styles from "./Layout.module.scss";
import type { RouteSectionProps } from "@solidjs/router";

const UserSelectLayout: Component<RouteSectionProps<unknown>> = (props) => {
    return (
        <div class={styles.root}>
            {props.children}
            <UKCard color={"outlined"} class={styles.copyrightContainer}>
                <UKText role={"title"} size={"m"} emphasized={true}>
                    Tricolor Workspaces Pre-Alpha
                </UKText>
                <UKText role={"body"} size={"s"} emphasized={true}>
                    © Copyright Tricolor 2025
                </UKText>
            </UKCard>
        </div>
    );
};

export default UserSelectLayout;
