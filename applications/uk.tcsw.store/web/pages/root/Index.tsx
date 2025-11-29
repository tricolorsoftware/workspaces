import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";
import styles from "./Index.module.scss";
import PromotedApplication from "./components/PromotedApplication/PromotedApplication";

const Page: Component = () => {
    return (
        <div class={styles.page}>
            <div class={styles.topBar}>
                <UKText role={"title"} size="l">
                    Promoted Applications
                </UKText>
            </div>
            <UKDivider direction={DividerDirection.horizontal} />
            <div class={styles.content}>
                <PromotedApplication />
                <PromotedApplication />
                <PromotedApplication />
                <PromotedApplication />
                <PromotedApplication />
            </div>
        </div>
    );
};

export default Page;
