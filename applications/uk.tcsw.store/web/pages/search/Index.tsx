import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import {DividerDirection} from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import {createSignal, type Component} from "solid-js";
import styles from "./Index.module.scss"
import UKTextField from "@tcsw/uikit-solid/src/components/textField/UKTextField.jsx";

const Page: Component = () => {
    const [ searchQuery, setSearchQuery ] = createSignal<string>("")

    return (
        <div class={styles.page}>
            <div class={styles.topBar}>
                <UKText role={"title"} size="l">
                    Search
                </UKText>
            </div>
            <UKDivider direction={DividerDirection.horizontal} />
            <div class={styles.content}>
                <UKTextField leadingIcon={"search"} getValue={setSearchQuery} setValue={searchQuery()} color={"filled"} label={"Search"} />
            </div>
        </div>
    );
};

export default Page;
