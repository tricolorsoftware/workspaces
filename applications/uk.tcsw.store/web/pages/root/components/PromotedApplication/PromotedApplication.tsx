import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";
import styles from "./PromotedApplication.module.scss";

const PromotedApplication: Component = () => {
    return (
        <>
            <UKCard color="filled" class={styles.root}>
                <img src={"/assets/tricolor/tricolor.svg"} class={styles.backgroundImage} />
                <div class={styles.footer}>
                    <UKText size="l" emphasized role="title">
                        {"Dashboard"}
                    </UKText>
                    <UKText size="s" role="body">
                        {"Work in progress"}
                    </UKText>
                </div>
            </UKCard>
        </>
    );
};

export default PromotedApplication;
