import { createResource, createSignal, Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tcsw/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";
import UKNavigationRail from "@tcsw/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import NavigationRailAvatar from "./navigationRailAvatar/NavigationRailAvatar";
import trpc from "../../lib/trpc";
import NavigationRailClock from "./navigationRailClock/NavigationRailClock.tsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.tsx";

const AppLayout: Component<RouteSectionProps<unknown>> = (props) => {
    const navigate = useNavigate();
    const [quickShortcuts] = createResource(() => trpc.app.navigation.quickShortcuts.query());

    const [expanded, setExpanded] = createSignal<boolean>(false);
    const [selected, setSelected] = createSignal<string>("");

    return (
        <UKNavigationRail
            expanded={expanded()}
            items={[
                ...(quickShortcuts() || []).map((sc) => {
                    return {
                        icon: sc.icon.value,
                        label: sc.label,
                        active: selected() === sc.label,
                        onClick() {
                            setSelected(sc.label);

                            if (sc.location.type === "local") {
                                navigate(sc.location.value);
                            } else if (sc.location.type === "remote") {
                                window.location.href = sc.location.value;
                            }
                        },
                    };
                }),
            ]}
            setExpanded={(exp) => setExpanded(exp)}
            anchorPoints={{
                topMost: (
                    <>
                        <NavigationRailClock expanded={expanded()} />
                    </>
                ),
                top: (
                    <>
                        <NavigationRailAvatar expanded={expanded()} />
                    </>
                ),
                bottom: (
                    <>
                        <UKText class={styles.versionLabel} role={"label"} size={"s"} emphasized={true} align={"center"}>
                            Dev Build
                        </UKText>
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
