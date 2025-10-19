import { Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import type { RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tricolor/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";
import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.jsx";

const AppLayout: Component<RouteSectionProps<unknown>> = (props) => {
    return (
        <div class={styles.root}>
            <UKAvatar avatar={"/assets/placeholder/avatar.png"} size="s" username="[PUT SIDEBAR HERE]" />
            <div class={styles.page}>
                <Suspense fallback={<UKIndeterminateSpinner />}>{props.children}</Suspense>
            </div>
        </div>
    );
};

export default AppLayout;
