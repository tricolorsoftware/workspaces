import { type Component } from "solid-js";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";

const App: Component = () => {
    return (
        <>
            <UKText size="l" emphasized role="display">
                {"Store (uk.tcsw.store) -> Work in progress"}
            </UKText>
        </>
    );
};

export default App;
