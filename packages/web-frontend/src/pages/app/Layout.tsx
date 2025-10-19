import { createSignal, Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import type { RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tricolor/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";
import UKNavigationRail from "@tricolor/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import UKIconButton from "@tricolor/uikit-solid/src/components/iconButton/UKIconButton.jsx";
import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.jsx";

const AppLayout: Component<RouteSectionProps<unknown>> = (props) => {
    const [expanded, setExpanded] = createSignal<boolean>(false);
    const [selected, setSelected] = createSignal<boolean>(false);

    return (
        <UKNavigationRail
            expanded={expanded()}
            items={[
                {
                    icon: "check",
                    label: "Select",
                    onClick() {
                        setSelected(!selected());
                    },
                    active: selected(),
                    badgeCount: 4,
                },
                {
                    icon: "check",
                    label: "Select",
                    onClick() {
                        setSelected(!selected());
                    },
                    active: selected(),
                    badgeCount: 4,
                },
            ]}
            anchorPoints={{
                top: (
                    <>
                        <UKIconButton onClick={() => setExpanded(!expanded())} width="narrow" alt="Toggle" icon="check" />
                        {/*<UKAvatar avatar={"/assets/placeholder/avatar.png"} size="s" username="[PUT SIDEBAR HERE]" />*/}
                    </>
                ),
            }}
        >
            <div class={styles.page}>
                <Suspense fallback={<UKIndeterminateSpinner />}>{props.children}</Suspense>
            </div>
        </UKNavigationRail>
    );
};

export default AppLayout;
