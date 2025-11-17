import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import {createResource, createSignal, For, type Component} from "solid-js";
import styles from "./Index.module.scss";
import UKIconButton from "@tcsw/uikit-solid/src/components/iconButton/UKIconButton.jsx";
import trpc from "../../lib/trpc";
import UKListItem from "@tcsw/uikit-solid/src/components/list/UKListItem.jsx";

const ManageInstalledPage: Component = () => {
    const [ selectionMode, setSelectionMode ] = createSignal<boolean>(false);
    const [ selectedApplicationIds, setSelectedApplicationIds ] = createSignal<string[]>([]);
    const [ installedApplications, setInstalledApplications ] = createResource(() => trpc.manageInstalled.getApplications.query());

    return (
        <div class={styles.page}>
            <div class={styles.topBar}>
                <UKText role={"title"} size="l">
                    Manage Installed Applications
                </UKText>
                {selectionMode() && <UKText role={"label"} size={"m"}>{`Selected: ${selectedApplicationIds().length}`}</UKText>}
                <UKIconButton
                    color={"standard"}
                    alt={"select"}
                    icon={selectionMode() ? "close_small" : "select"}
                    onClick={() => {
                        if (selectionMode())
                            setSelectedApplicationIds([])

                        setSelectionMode(!selectionMode());
                    }}
                />
                {!selectionMode() && (
                    <UKIconButton
                        color={"filled"}
                        alt={"install application"}
                        icon={"add"}
                        onClick={() => {
                            // add logic
                        }}
                    />
                )}
            </div>
            <div class={styles.content} data-view-type={"list"}>
                <For each={installedApplications()?.applications || []}>
                    {(app) => {
                        return (
                            <UKListItem
                                onClick={() => {
                                    if (selectionMode()) {
                                        if (!selectedApplicationIds().includes(app.id)) {
                                            setSelectedApplicationIds((prev) => [ ...prev, app.id ])
                                        } else {
                                            setSelectedApplicationIds(prev => prev.filter(i => i !== app.id))
                                        }
                                    }
                                }}
                                labelText={app.displayName}
                                supportingText={app.id}
                                lines={1}
                                leading={{type: "image", value: "unknown", alt: ""}}
                                trailing={selectedApplicationIds().includes(app.id) ? {type: "icon", value: "check"} : undefined}
                            ></UKListItem>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

export default ManageInstalledPage;
