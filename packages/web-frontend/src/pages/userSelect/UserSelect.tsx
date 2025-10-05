import type { Component } from "solid-js";
import { page } from "./UserSelect.css.ts";
import UKCard from "@tricolor/uikit-mv3-solid/src/components/card/UKCard.tsx";
import UKButton from "@tricolor/uikit-mv3-solid/src/components/button/UKButton.tsx";
import UKButtonGroup from "@tricolor/uikit-mv3-solid/src/components/buttonGroup/UKButtonGroup.tsx";
import UKDivider from "@tricolor/uikit-mv3-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tricolor/uikit-mv3-solid/src/components/divider/lib/direction.ts";

const UserSelectPage: Component = () => {
    return (
        <div class={page}>
            <UKCard color={"filled"}>
                <UKDivider direction={DividerDirection.horizontal} />
                <UKButtonGroup size={"s"}>
                    <UKButton onClick={() => 0} color={"tonal"}>
                        Signup
                    </UKButton>
                    <UKButton onClick={() => 0} color={"filled"}>
                        Login
                    </UKButton>
                </UKButtonGroup>
            </UKCard>
            <UKCard color={"elevated"}>
                <UKDivider direction={DividerDirection.horizontal} />
                <UKButtonGroup size={"s"}>
                    <UKButton onClick={() => 0} color={"tonal"}>
                        Signup
                    </UKButton>
                    <UKButton onClick={() => 0} color={"filled"}>
                        Login
                    </UKButton>
                </UKButtonGroup>
            </UKCard>
            <UKCard color={"outlined"}>
                <UKDivider direction={DividerDirection.horizontal} />
                <UKButtonGroup size={"s"}>
                    <UKButton onClick={() => 0} color={"tonal"}>
                        Signup
                    </UKButton>
                    <UKButton onClick={() => 0} color={"filled"}>
                        Login
                    </UKButton>
                </UKButtonGroup>
            </UKCard>
            User Select Page
        </div>
    );
};

export default UserSelectPage;
