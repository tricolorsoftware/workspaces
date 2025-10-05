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
import UKSearchableDropdownMenu from "@tricolor/uikit-solid/src/components/searchableDropdownMenu/UKSearchableDropdownMenu.tsx";
import { SearchableDropdownMenuItemType } from "@tricolor/uikit-solid/src/components/searchableDropdownMenu/lib/items.ts";
import isEmail from "@tricolor/uikit-solid/src/core/validation/isEmail.ts";

enum UserSelectStage {
    Username, // set username
    Email, // set email
    VerifyEmail, // verify they own the email
    Password, // set password
    TwoFactorAuthentication, // set 2FA
    VerifyTwoFactorAuthentication, // verify they set up 2FA correctly
    Profile, // set profile information
    TermsOfUse, // accept the terms of use for this instance
    GuidePrompt, // prompt the user for if they want to see the introductory guide
    Guide, // guide the new user through the basics
}

const UserSelectPage: Component = () => {
    const navigate = useNavigate();
    const [stage, setStage] = createSignal<UserSelectStage>(UserSelectStage.Username);

    const [username, setUsername] = createSignal<string>("");
    const [password, setPassword] = createSignal<string>("");
    const [confirmedPassword, setConfirmedPassword] = createSignal<string>("");
    const [emailAddress, setEmailAddress] = createSignal<`${string}@${string}.${string}` | "">("");
    const [emailCode, setEmailCode] = createSignal<string>("");
    const [displayName, setDisplayName] = createSignal<string>("");
    const [gender, setGender] = createSignal<"female" | "male" | "other">("other");
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
                        label={"Username*"}
                        supportingText={"*required"}
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
                        Set Email
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        color={"outlined"}
                        label={"Email Address*"}
                        defaultValue={emailAddress()}
                        getValue={setEmailAddress}
                        maximumCharacterCount={32} // this is arbitrary
                        supportingText={"*required"}
                        error={emailAddress() !== "" && !isEmail(emailAddress())}
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
                            disabled={emailAddress() === "" || !isEmail(emailAddress())}
                            onClick={() => {
                                setStage(UserSelectStage.VerifyEmail);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.VerifyEmail}>
                <UKCard color={"filled"} class={styles.modal}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Verify Email
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        color={"outlined"}
                        label={"Email Verification Code*"}
                        defaultValue={emailCode()}
                        getValue={setEmailCode}
                        maximumCharacterCount={8}
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
                            disabled={emailCode() === ""}
                            onClick={() => {
                                alert("CHECK THE EMAIL CODE AGAINST THE SERVER BEFORE CONTINUING");

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
                        Set Password
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKTextField
                        shouldMask={true}
                        color={"outlined"}
                        label={"Password*"}
                        defaultValue={password()}
                        getValue={setPassword}
                        supportingText={"*required"}
                        error={password() !== confirmedPassword()}
                    />
                    <UKTextField
                        shouldMask={true}
                        color={"outlined"}
                        label={"Confirm Password*"}
                        defaultValue={confirmedPassword()}
                        getValue={setConfirmedPassword}
                        supportingText={"*required"}
                        error={password() !== confirmedPassword()}
                    />
                    <div class={styles.stageButtons}>
                        <UKButton
                            onClick={() => {
                                setStage(UserSelectStage.VerifyEmail);
                            }}
                            color={"tonal"}
                        >
                            Back
                        </UKButton>
                        <UKButton
                            disabled={password() !== confirmedPassword() || password() === ""}
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
                        maximumCharacterCount={6}
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
                    <UKText class={styles.displayName} role={"headline"} align={"center"} size={"l"} emphasized={true}>
                        {displayName() || username()}
                    </UKText>
                    <UKText class={styles.username} role={"body"} align={"center"} size={"m"}>
                        {`@${username()}`}
                    </UKText>
                    <UKText class={styles.pronouns} role={"label"} align={"center"} size={"s"}>
                        {gender() === "female" ? "she/her" : gender() === "male" ? "he/him" : "they/them"}
                    </UKText>
                    <UKTextField color={"outlined"} label={"Display Name"} defaultValue={displayName()} getValue={setDisplayName} />
                    <UKSearchableDropdownMenu
                        inputColor={"outlined"}
                        label={"Gender"}
                        defaultValue={gender()}
                        // @ts-ignore
                        getValue={(val) => setGender(val.toLowerCase())}
                        items={[
                            {
                                type: SearchableDropdownMenuItemType.Button,
                                label: "Female",
                            },
                            {
                                type: SearchableDropdownMenuItemType.Button,
                                label: "Male",
                            },
                            {
                                type: SearchableDropdownMenuItemType.Button,
                                label: "Other",
                            },
                        ]}
                    />
                    <UKTextField color={"outlined"} label={"Bio"} as={"textarea"} defaultValue={bio()} getValue={setBio} />
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
                            onClick={() => {
                                if (displayName() === "") {
                                    setDisplayName(username());
                                }

                                setStage(UserSelectStage.TermsOfUse);
                            }}
                            color={"filled"}
                        >
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.TermsOfUse}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.termsOfUseStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Terms Of Use
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKText role={"body"} size={"m"}>
                        {"[TERMS OF USE HERE] (Fetch this from the instance when the required API is implemented)"}
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKText role={"title"} size={"m"} align={"center"}>
                        You must agree to the terms above to continue
                    </UKText>
                    <div class={styles.continueSegment}>
                        <UKButton onClick={() => navigate("/")} color={"tonal"}>
                            Deny
                        </UKButton>
                        <UKButton
                            onClick={() => {
                                // HERE WE CALL THE API TO CREATE THE USER
                                alert("Here we should create the user");

                                setStage(UserSelectStage.GuidePrompt);
                            }}
                            color={"filled"}
                        >
                            Agree and Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.GuidePrompt}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.guidePromptStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        Guide
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKText role={"body"} size={"l"} align={"center"}>
                        {"Would you like to have a guide of Workspaces?"}
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <div class={styles.continueSegment}>
                        <UKButton onClick={() => navigate("/app")} color={"tonal"}>
                            Skip guide
                        </UKButton>
                        <UKButton onClick={() => setStage(UserSelectStage.Guide)} color={"filled"}>
                            Continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
            <Match when={stage() === UserSelectStage.Guide}>
                <UKCard color={"filled"} class={clsx(styles.modal, styles.guideStage)}>
                    <UKText role={"title"} size={"l"} emphasized={true}>
                        {"Unimplemented"}
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <UKText role={"body"} size={"l"} align={"center"} emphasized={true}>
                        {"The guide is not yet implemented"}
                    </UKText>
                    <UKDivider direction={DividerDirection.horizontal} />
                    <div class={styles.continueSegment}>
                        <UKButton onClick={() => navigate("/app")} color={"filled"}>
                            Skip guide and continue
                        </UKButton>
                    </div>
                </UKCard>
            </Match>
        </Switch>
    );
};

export default UserSelectPage;
