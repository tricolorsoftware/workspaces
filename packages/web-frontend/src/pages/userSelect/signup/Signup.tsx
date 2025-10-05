import { type Component, createSignal } from "solid-js";
import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.tsx";
import UKButton from "@tricolor/uikit-solid/src/components/button/UKButton.tsx";
import UKDivider from "@tricolor/uikit-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tricolor/uikit-solid/src/components/divider/lib/direction.ts";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.tsx";
import UKTextField from "@tricolor/uikit-solid/src/components/textField/UKTextField.tsx";
import { useNavigate } from "@solidjs/router";
import styles from "./Signup.module.scss";

const UserSelectPage: Component = () => {
    const navigate = useNavigate();

    const [username, setUsername] = createSignal("");

    return (
        <UKCard color={"filled"} class={styles.modal}>
            <UKText role={"title"} size={"l"} emphasized={true}>
                Signup
            </UKText>
            <UKDivider direction={DividerDirection.horizontal} />
            <UKTextField color={"outlined"} label={"Username"} getValue={setUsername} />
            <div class={styles.signup}>
                <UKButton disabled={username() === ""} onClick={() => {}} color={"filled"}>
                    Continue
                </UKButton>
            </div>
            <UKDivider direction={DividerDirection.horizontal} />
            <div class={styles.loginSegment}>
                <UKText role={"body"} size={"m"}>
                    Already have an account?
                </UKText>
                <UKButton onClick={() => navigate("/")} color={"tonal"}>
                    Login
                </UKButton>
            </div>
        </UKCard>
    );
};

export default UserSelectPage;
