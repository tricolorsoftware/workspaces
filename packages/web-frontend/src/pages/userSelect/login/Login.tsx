import { type Component, createSignal } from "solid-js";
import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.tsx";
import UKButton from "@tricolor/uikit-solid/src/components/button/UKButton.tsx";
import UKDivider from "@tricolor/uikit-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tricolor/uikit-solid/src/components/divider/lib/direction.ts";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.tsx";
import styles from "./Login.module.scss";
import UKTextField from "@tricolor/uikit-solid/src/components/textField/UKTextField.tsx";

const UserSelectPage: Component = () => {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");

    return (
        <div class={styles.root}>
            <UKCard color={"filled"} class={styles.modal}>
                <UKText role={"title"} size={"l"} emphasized={true}>
                    Sign In
                </UKText>
                <UKDivider direction={DividerDirection.horizontal} />
                <UKTextField color={"outlined"} label={"Username"} getValue={setUsername} />
                <UKTextField color={"outlined"} label={"Password"} getValue={setPassword} />
                <div class={styles.loginButtons}>
                    <UKButton onClick={() => 0} disabled={username() === ""} color={"standard"}>
                        Forgot password?
                    </UKButton>
                    <UKButton
                        disabled={username() === "" || password() === ""}
                        onClick={() => {
                            console.log("Requesting login for", username(), password());
                        }}
                        color={"filled"}
                    >
                        Login
                    </UKButton>
                </div>
                <UKDivider direction={DividerDirection.horizontal} />
                <div class={styles.signupSegment}>
                    <UKText role={"body"} size={"m"}>
                        Don't have an account?
                    </UKText>
                    <UKButton onClick={() => 0} color={"tonal"}>
                        Signup
                    </UKButton>
                </div>
            </UKCard>
            <UKCard color={"outlined"} class={styles.copyrightContainer}>
                <UKText role={"title"} size={"m"} emphasized={true}>
                    Tricolor Workspaces Pre-Alpha
                </UKText>
                <UKText role={"body"} size={"s"} emphasized={true}>
                    © Copyright Tricolor 2025
                </UKText>
            </UKCard>
        </div>
    );
};

export default UserSelectPage;
