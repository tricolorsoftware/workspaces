import { createResource, createSignal, Suspense, type Component } from "solid-js";
import styles from "./Layout.module.scss";
import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import UKIndeterminateSpinner from "@tcsw/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.jsx";
import UKNavigationRail from "@tcsw/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import NavigationRailAvatar from "./navigationRailAvatar/NavigationRailAvatar";
import trpc from "../../lib/trpc";

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
                {
                    icon: "check",
                    label: "Select",
                    onClick() {
                        setSelected("select");
                    },
                    active: selected() === "select",
                    badgeCount: 4,
                },
                {
                    icon: "check",
                    label: "Select1",
                    onClick() {
                        setSelected("select1");
                    },
                    active: selected() === "select1",
                    badgeCount: 1,
                },
                {
                    icon: "check",
                    label: "Select2",
                    onClick() {
                        setSelected("select2");
                    },
                    active: selected() === "select2",
                    badgeCount: 0,
                },
                {
                    icon: "check",
                    label: "Select Something Ig",
                    onClick() {
                        setSelected("Select Something Ig");
                    },
                    active: selected() === "Select Something Ig",
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
