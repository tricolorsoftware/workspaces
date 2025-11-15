import { type Component, createResource, type ParentProps } from "solid-js";
import trpc from "../../lib/trpc.ts";
import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.tsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.tsx";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.tsx";
import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.ts";
import styles from "./AuthCheck.module.scss";
import UKButton from "@tcsw/uikit-solid/src/components/button/UKButton.tsx";
import { useNavigate } from "@solidjs/router";
import UKIndeterminateSpinner from "@tcsw/uikit-solid/src/components/indeterminateSpinner/UKIndeterminateSpinner.tsx";

const AuthCheck: Component<ParentProps> = (props) => {
    const navigate = useNavigate();
    const [checkResult] = createResource(() => trpc.authorization.isAuthenticated.query());

    return (
        <>
            {checkResult() === undefined ? (
                <UKIndeterminateSpinner class={styles.spinner} />
            ) : (
                <>
                    {!checkResult()?.authenticated ? (
                        <UKCard color={"filled"} class={styles.root}>
                            <UKText role={"title"} size={"l"} emphasized={true}>
                                Unauthorized
                            </UKText>
                            <UKDivider direction={DividerDirection.horizontal} />
                            <UKText role={"body"} size={"l"}>
                                Please login before trying to access this page.
                            </UKText>
                            <UKButton
                                class={styles.button}
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                Login
                            </UKButton>
                        </UKCard>
                    ) : (
                        props.children
                    )}
                </>
            )}
        </>
    );
};

export default AuthCheck;
