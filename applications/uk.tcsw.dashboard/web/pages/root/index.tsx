import type {Component} from "solid-js";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import Widgets from "../../widgets/widgets";

const RootPage: Component = () => {
    return <>
        <UKText size="l" emphasized role="display">
            {"Dashboard (uk.tcsw.dashboard) -> Work in progress"}
        </UKText>
        <Widgets.user.profile />
    </>
}

export default RootPage