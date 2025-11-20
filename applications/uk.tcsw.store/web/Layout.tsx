import {useNavigate} from "@solidjs/router";
import UKNavigationRail from "@tcsw/uikit-solid/src/components/navigationRail/UKNavigationRail.jsx";
import type {Component, ParentProps} from "solid-js";

const Layout: Component<ParentProps> = (props) => {
    const navigate = useNavigate()

    return <UKNavigationRail
        items={[
            {
                icon: "home",
                label: "Home",
                onClick() {
                    navigate("/app/uk.tcsw.store")
                }
            },
            {
                icon: "apps",
                label: "Installed",
                onClick() {
                    navigate("/app/uk.tcsw.store/manage-installed")
                }
            }
        ]}
    >
        {props.children}
    </UKNavigationRail>
}

export default Layout