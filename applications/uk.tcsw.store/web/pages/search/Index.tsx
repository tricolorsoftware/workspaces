import { DividerDirection } from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import { createSignal, type Component } from "solid-js";
import styles from "./Index.module.scss";
import UKTextField from "@tcsw/uikit-solid/src/components/textField/UKTextField.jsx";
import SearchResult from "./components/SearchResult/SearchResult";

const Page: Component = () => {
    const [searchQuery, setSearchQuery] = createSignal<string>("");

    return (
        <div class={styles.page}>
            <div class={styles.topBar}>
                <UKText role={"title"} size="l">
                    Search
                </UKText>
            </div>
            <UKDivider direction={DividerDirection.horizontal} />
            <div class={styles.content}>
                <UKTextField
                    leadingIcon={{
                        icon: "search",
                        onClick: () => {
                            return 0;
                        },
                    }}
                    getValue={setSearchQuery}
                    setValue={searchQuery()}
                    color={"filled"}
                    label={"Search"}
                />
                <UKDivider direction={DividerDirection.horizontal} />
                <UKText role="headline" size="m" align="center">
                    This is unimplemented
                </UKText>
                <UKDivider direction={DividerDirection.horizontal} />
                <div class={styles.resultGrid}>
                    <SearchResult title={"Dashboard"} publisher={"Tricolor Software"} downloadCount={20} id={"uk.tcsw.dashboard"} />
                    <SearchResult title={"Store"} publisher={"Tricolor Software"} downloadCount={10} id={"uk.tcsw.store"} />
                    <SearchResult title={"Network Mapper"} publisher={"Tricolor Software"} downloadCount={202} id={"uk.tcsw.netmap"} />
                    <SearchResult title={"Dashboard"} publisher={"Tricolor Software"} downloadCount={20} id={"uk.tcsw.dashboard"} />
                    <SearchResult title={"Dashboard"} publisher={"Tricolor Software"} downloadCount={203} id={"uk.tcsw.dashboard"} />
                    <SearchResult title={"Dashboard"} publisher={"Tricolor Software"} downloadCount={40} id={"uk.tcsw.dashboard"} />
                </div>
            </div>
        </div>
    );
};

export default Page;
