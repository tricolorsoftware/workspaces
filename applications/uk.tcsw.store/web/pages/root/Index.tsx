import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type { Component } from "solid-js";

const Page: Component = () => {
    return (
        <>
            <UKText size="l" emphasized role="display">
                {"Store (uk.tcsw.store) -> Work in progress"}
            </UKText>
            <UKCard color="filled">
                <img src={"/assets/tricolor/tricolor.svg"} />
                <UKText size="m" emphasized role="title">
                    {"Dashboard"}
                </UKText>
                <UKText size="m" emphasized role="body">
                    {"Work in progress"}
                </UKText>
            </UKCard>
        </>
    );
};

export default Page;
