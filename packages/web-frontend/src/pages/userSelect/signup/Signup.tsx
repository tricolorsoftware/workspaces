import { type Component, createSignal, Match, Switch } from "solid-js";
import UKCard from "@tricolor/uikit-solid/src/components/card/UKCard.tsx";
import UKButton from "@tricolor/uikit-solid/src/components/button/UKButton.tsx";
import UKDivider from "@tricolor/uikit-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tricolor/uikit-solid/src/components/divider/lib/direction.ts";
import UKText from "@tricolor/uikit-solid/src/components/text/UKText.tsx";
import UKTextField from "@tricolor/uikit-solid/src/components/textField/UKTextField.tsx";
import { useNavigate } from "@solidjs/router";
import styles from "./Signup.module.scss";
import clsx from "clsx";
import UKAvatar from "@tricolor/uikit-solid/src/components/avatar/UKAvatar.tsx";

enum UserSelectStage {
    Username,
    Email,
    VerifyEmail,
    Password,
    TwoFactorAuthentication,
    VerifyTwoFactorAuthentication,
    Profile,
}

const UserSelectPage: Component = () => {
    const navigate = useNavigate();
    const [stage, setStage] = createSignal<UserSelectStage>(UserSelectStage.Username);

    const [username, setUsername] = createSignal<string>("");
    const [password, setPassword] = createSignal<string>("");
    const [emailAddress, setEmailAddress] = createSignal<`${string}@${string}.${string}` | "">("");
    const [displayName, setDisplayName] = createSignal<string>("");
    const [gender, setGender] = createSignal<"female" | "male" | "other" | undefined>(undefined);
    const [bio, setBio] = createSignal<string>("");

    const [twoFactorTestCode, setTwoFactorTestCode] = createSignal<string>("");

    return (
        <Switch>
            <Match when={stage() === UserSelectStage.Username}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.usernameStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Signup
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        leadingIcon={"user"}
                        trailingIcon={""}
                        color={"outlined"}
                        label={"Username"}
                        defaultValue={username()}
                        getValue={setUsername}
                        onSubmit={() => {
                            if (username() !== "") setStage(UserSelectStage.Email);
                        }}
                    />
                    <div class={styles.stageButtons}>
                        <UKButton
                            disabled={username() === ""}
                            onClick={() => {
                                setStage(UserSelectStage.Email);
                            }}
                            color={"filled"}
                        >
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
            </Match>
            <Match when={stage() === UserSelectStage.Email}>
                <UKCard color={"filled"} class={styles.modal}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Email
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        color={"outlined"}
                        label={"Email Address*"}
                        defaultValue={emailAddress()}
                        getValue={setEmailAddress}
                        maximumCharacterCount={32} // this is arbitrary
                        supportingText={"*required"}
                    />
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.Username);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            disabled={emailAddress() === ""}
                            onClick={() => {
                                setStage(UserSelectStage.Password);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.Password}>
                <UKCard color={"filled"} class={styles.modal}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Password
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        shouldMask={true}
                        color={"outlined"}
                        label={"Password*"}
                        defaultValue={password()}
                        getValue={setPassword}
                        supportingText={"*required"}
                    />
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.Email);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            disabled={password() === ""}
                            onClick={() => {
                                setStage(UserSelectStage.TwoFactorAuthentication);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.TwoFactorAuthentication}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.twoFactorStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Setup Two Factor Authentication
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <div>[QR CODE IMAGE HERE]</div>
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.Password);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.VerifyTwoFactorAuthentication);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKButton
                        class={styles.skipButton}
                        onClick={() => {
                            setStage(UserSelectStage.Profile);
                        }}
                        color={"standard"}
                    >
                        Skip Two Factor Setup
                    </UKButton>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.VerifyTwoFactorAuthentication}>
                <UKCard color={"filled"} class={styles.modal}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Two Factor Authentication Verification
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        color={"outlined"}
                        label={"Two Factor Code*"}
                        defaultValue={twoFactorTestCode()}
                        getValue={setTwoFactorTestCode}
                        supportingText={"*required"}
                    />
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.TwoFactorAuthentication);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            disabled={twoFactorTestCode() === ""}
                            onClick={() => {
                                alert("FIXME: THIS BUTTON SHOULD DISABLE IF THE CODE IS INCORRECT!");
                                setStage(UserSelectStage.Profile);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.Profile}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.profileStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Setup Profile
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKAvatar class={styles.avatar} size={"l"} username={username()} avatar={"/assets/placeholder/avatar.png"} />
                    <UKText class={styles.username} role={"label"} align={"center"} size={"m"} emphasized={true}>
                        {`@${username()}`}
                    </UKText>
                    <UKTextField color={"outlined"} label={"Display Name"} defaultValue={displayName()} getValue={setDisplayName} />
                    <UKTextField color={"outlined"} label={"Gender (make me a dropdown)"} defaultValue={gender()} getValue={setGender} />
                    <UKTextField color={"outlined"} label={"Bio"} as={"textarea"} defaultValue={gender()} getValue={setGender} />
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.Password);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            disabled={twoFactorTestCode() === ""}
                            onClick={() => {
                                alert("FIXME: THIS BUTTON SHOULD DISABLE IF THE CODE IS INCORRECT!");
                                setStage(UserSelectStage.Profile);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
        </Switch>
    );
};

export default UserSelectPage;
