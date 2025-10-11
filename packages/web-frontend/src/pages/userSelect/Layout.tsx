import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.jsx";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.jsx";
import { Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import type { RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tricolor/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";

const UserSelectLayout: Component<RouteSectionProps<unknown>> = (props) => {
    return (
        <div class={styles.root}>
            <Suspense fallback={<UKIndeterminateSpinner />}>{props.children}</Suspense>
            <UKCard color={"outlined"} class={styles.copyrightContainer}>
                <UKText role={"title"} size={"m"} emphasized={true}>
                    Tricolor Workspaces Pre-Alpha
                </UKText>
                <UKText href="https://tcsw.uk" role={"body"} size={"s"} emphasized={true}>
                    © Copyright Tricolor Software 2025
                </UKText>
            </UKCard>
        </div>
    );
};

export default UserSelectLayout;
