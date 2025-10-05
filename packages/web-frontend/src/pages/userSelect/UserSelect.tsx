import type { Component } from "solid-js";
import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.tsx";
import UKButton from "@tricolor/uikit-solid/src/components/button/UKButton.tsx";
import UKButtonGroup from "@tricolor/uikit-solid/src/components/buttonGroup/UKButtonGroup.tsx";
import UKDivider from "@tricolor/uikit-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tricolor/uikit-solid/src/components/divider/lib/direction.ts";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.tsx";
import styles from "./UserSelect.module.scss"
import UKTextField from "@tricolor/uikit-solid/src/components/textField/UKTextField.tsx";

const UserSelectPage: Component = () => {
    return (
            <UKCard color={"filled"} class={styles.root}>
                <UKText role={"title"} size={"l"}>
                    Sign In
                </UKText>
                <UKDivider direction={DividerDirection.horizontal} />
                <UKTextField color={"outlined"} label={"Username"}/>
                <UKTextField color={"outlined"} label={"Password"}/>
                <UKButtonGroup size={"s"}>
                    <UKButton onClick={() => 0} color={"standard"}>
                        Forgot password?
                    </UKButton>
                    <UKButton onClick={() => 0} color={"filled"}>
                        Login
                    </UKButton>
                </UKButtonGroup>
                <UKText role={"body"} size={"m"}>
                    Don't have an account?
                </UKText>
                <UKButton onClick={() => 0} color={"tonal"}>
                    Signup
                </UKButton>
            </UKCard>
    );
};

export default UserSelectPage;
