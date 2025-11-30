import { createResource, type Component } from "solid-js";
import styles from "./index.module.scss";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKAvatar from "@tcsw/uikit-solid/src/components/avatar/UKAvatar.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import Shortcut from "./component/Shortcut/Shortcut";
import trpc from "../../lib/trpc";

const RootPage: Component = () => {
    const [fullName] = createResource(() => trpc.overview.user.fullName.query());
    const [role] = createResource(() => trpc.overview.user.role.query());

    return (
        <div class={styles.root}>
            <div class={styles.content}>
                <div class={styles.header}>
                    <UKAvatar username="username" avatar="/assets/placeholder/avatar.png" size="l" />
                    <div>
                        <UKText role="display" size="l" emphasized class={styles.fullName}>
                            {fullName() || "Unknown"}
                        </UKText>
                        <UKText role="label" size="m" class={styles.permissionLevel}>
                            {role() || "Unknown"}
                        </UKText>
                    </div>
                </div>
                <UKDivider class={styles.divider} direction={DividerDirection.horizontal} width="middle-inset" />
                <Shortcut
                    title="Storage"
                    description="Visualise storage usage & clean up duplicates"
                    icon="storage"
                    path="/app/uk.tcsw.settings/storage"
                />
                <Shortcut
                    title="Customization"
                    description="Choose a wallpaper and color theme"
                    icon="wallpaper"
                    path="/app/uk.tcsw.settings/customization"
                />
                <Shortcut
                    title="Configure Instance"
                    description="(ADMINISTRATORS ONLY) Manage the instance & it’s users"
                    icon="settings_applications"
                    path="/app/uk.tcsw.settings/instance"
                />
            </div>
        </div>
    );
};

export default RootPage;
