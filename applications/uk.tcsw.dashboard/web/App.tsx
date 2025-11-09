import { type Component } from "solid-js";
import Widgets from "./widgets/widgets";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";

const App: Component = () => {
    return (
        <>
            <UKText size="l" emphasized role="display">
                {"Dashboard (uk.tcsw.dashboard) -> Work in progress"}
            </UKText>
            <Widgets.user.profile />
        </>
    );
};

export default App;
