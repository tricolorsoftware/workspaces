import { createSignal, Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import type { RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tricolor/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";
import UKNavigationRail from "@tricolor/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.jsx";
import NavigationRailAvatar from "./navigationRailAvatar/NavigationRailAvatar";

const AppLayout: Component<RouteSectionProps<unknown>> = (props) => {
    const [expanded, setExpanded] = createSignal<boolean>(false);
    const [selected, setSelected] = createSignal<boolean>(false);
    const [selected2, setSelected2] = createSignal<boolean>(false);
    const [selected3, setSelected3] = createSignal<boolean>(false);
    const [selected4, setSelected4] = createSignal<boolean>(false);

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
                        setSelected2(!selected2());
                    },
                    active: selected2(),
                    badgeCount: 1,
                },
                {
                    icon: "check",
                    label: "Select",
                    onClick() {
                        setSelected3(!selected3());
                    },
                    active: selected3(),
                    badgeCount: 0,
                },
                {
                    icon: "check",
                    label: "Select Something Ig",
                    onClick() {
                        setSelected4(!selected4());
                    },
                    active: selected4(),
                    badgeCount: 0,
                },
            ]}
            setExpanded={(exp) => setExpanded(exp)}
            anchorPoints={{
                top: (
                    <>
                        <NavigationRailAvatar expanded={expanded()} />
                    </>
                ),
                bottom: (
                    <>
                        <img class={styles.tricolor} draggable={false} src="/assets/tricolor/tricolor_icon_transparent.svg" alt="" />
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
