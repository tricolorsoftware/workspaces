import { type Component } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.jsx";

const NotFoundPage: Component<RouteSectionProps<unknown>> = () => {
    return (
        <div>
            <UKText emphasized size="l" role="display">
                404 - Not Found
            </UKText>
        </div>
    );
};

export default NotFoundPage;
