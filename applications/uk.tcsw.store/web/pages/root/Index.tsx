import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";
import styles from "./Index.module.scss";

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
                <UKCard color="filled">
                    <img src={"/assets/tricolor/tricolor.svg"} />
                    <UKText size="m" emphasized role="title">
                        {"Dashboard"}
                    </UKText>
                    <UKText size="m" emphasized role="body">
                        {"Work in progress"}
                    </UKText>
                </UKCard>
            </div>
        </div>
    );
};

export default Page;
