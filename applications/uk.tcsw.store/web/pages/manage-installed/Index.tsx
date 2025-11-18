import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import {createEffect, createResource, createSignal, For, type Component} from "solid-js";
import styles from "./Index.module.scss";
import UKIconButton from "@tcsw/uikit-solid/src/components/iconButton/UKIconButton.jsx";
import trpc from "../../lib/trpc";
import UKListItem from "@tcsw/uikit-solid/src/components/list/UKListItem.jsx";
import UKButton from "@tcsw/uikit-solid/src/components/button/UKButton.jsx";
import UKDivider from "@tcsw/uikit-solid/src/components/divider/UKDivider.jsx";
import {DividerDirection} from "@tcsw/uikit-solid/src/components/divider/lib/direction.js";

const ManageInstalledPage: Component = () => {
    const [ selectionMode, setSelectionMode ] = createSignal<boolean>(false);
    const [ selectedApplicationIds, setSelectedApplicationIds ] = createSignal<string[]>([]);
    const [ installedApplications, setInstalledApplications ] = createResource(() => trpc.manageInstalled.getApplications.query());
    const [ enabledApplications, setEnabledApplications ] = createSignal<string[]>([])

    createEffect(() => {
        setEnabledApplications(installedApplications()?.enabledApplications || [])
    })

    return (
        <div class={styles.page}>
            <div class={styles.topBar}>
                <UKText role={"title"} size="l">
                    Manage Installed Applications
                </UKText>
                {selectedApplicationIds().length > 0 && <>
                    <UKButton
                        leadingIcon={"delete"}
                        onClick={() => {
                            return
                        }}
                        color={"filled"}
                        size={"s"}
                    >
                        Uninstall
                    </UKButton>
                </>}
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
            <UKDivider direction={DividerDirection.horizontal} />
            <div class={styles.content} data-view-type={"list"}>
                <For each={installedApplications()?.applications || []}>
                    {(app) => {
                        return (
                            <UKListItem
                                divider
                                onClick={() => {
                                    if (selectionMode()) {
                                        if (!selectedApplicationIds().includes(app.id)) {
                                            setSelectedApplicationIds((prev) => [ ...prev, app.id ])
                                        } else {
                                            setSelectedApplicationIds(prev => prev.filter(i => i !== app.id))
                                        }
                                    } else {
                                        if (!enabledApplications().includes(app.id)) {
                                            setEnabledApplications((prev) => [ ...prev, app.id ])
                                        } else {
                                            setEnabledApplications(prev => prev.filter(i => i !== app.id))
                                        }
                                    }
                                }}
                                labelText={app.displayName}
                                supportingText={`(${app.id}) - ${app.description}`}
                                lines={2}
                                leading={app.icon.type === "icon" ? {type: "icon", value: app.icon.value} : {type: "image", value: "unknown", alt: ""}}
                                trailing={selectionMode()
                                    ? selectedApplicationIds().includes(app.id)
                                        ? {
                                            type: "icon",
                                            value: "check"
                                        }
                                        : {
                                            type: "icon",
                                            value: "check_indeterminate_small"
                                        }
                                    : {
                                        type: "text",
                                        value: enabledApplications().includes(app.id)
                                            ? "enabled"
                                            : "disabled"
                                    }}
                            ></UKListItem>
                        );
                    }}
                </For>
            </div>
            <div class={styles.actions}>
                <UKButton onClick={() => {}} color={"filled"} size={"s"}>Apply Changes</UKButton>
            </div>
        </div>
    );
};

export default ManageInstalledPage;
