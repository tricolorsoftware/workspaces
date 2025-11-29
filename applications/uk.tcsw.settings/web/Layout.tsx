import { useLocation, useNavigate } from "@solidjs/router";
import UKNavigationRail from "@tcsw/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import type { Component, ParentProps } from "solid-js";

const Layout: Component<ParentProps> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <UKNavigationRail
            expanded={true}
            items={[
                {
                    icon: "home",
                    label: "Overview",
                    onClick() {
                        navigate("/app/uk.tcsw.settings/");
                    },
                    active: location.pathname === "/app/uk.tcsw.settings/",
                },
                {
                    icon: "person",
                    label: "Profile",
                    onClick() {
                        navigate("/app/uk.tcsw.settings/profile");
                    },
                    active: location.pathname === "/app/uk.tcsw.settings/profile",
                },
                {
                    icon: "storage",
                    label: "Storage",
                    onClick() {
                        navigate("/app/uk.tcsw.settings/storage");
                    },
                    active: location.pathname === "/app/uk.tcsw.settings/storage",
                },
                {
                    icon: "wallpaper",
                    label: "Customization",
                    onClick() {
                        navigate("/app/uk.tcsw.settings/customization");
                    },
                    active: location.pathname === "/app/uk.tcsw.settings/customization",
                },
                {
                    icon: "settings_applications",
                    label: "Configure Instance",
                    onClick() {
                        navigate("/app/uk.tcsw.settings/instance");
                    },
                    active: location.pathname === "/app/uk.tcsw.settings/instance",
                },
            ]}
        >
            {props.children}
        </UKNavigationRail>
    );
};

export default Layout;
