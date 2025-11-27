import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import type { Component } from "solid-js";
import type { WorkspacesNotification } from "../../../../../../subsystems/notifications";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKIcon from "@tcsw/uikit-solid/src/components/icon/UKIcon.jsx";
import UKButton from "@tcsw/uikit-solid/src/components/button/UKButton.jsx";

const Nofification: Component<{ notification: WorkspacesNotification }> = (props) => {
    return (
        <UKCard>
            <div class={"progress"}></div>
            {props.notification.content.icon && <UKIcon>{props.notification.content.icon}</UKIcon>}
            <UKText role="title" size="m">
                {props.notification.content.title}
            </UKText>
            <UKDivider direction={DividerDirection.horizontal} />
            <UKText role="body" size="m">
                {props.notification.content.body}
            </UKText>
            <UKButton onClick={() => 0}>Ok</UKButton>
        </UKCard>
    );
};

export default Nofification;
