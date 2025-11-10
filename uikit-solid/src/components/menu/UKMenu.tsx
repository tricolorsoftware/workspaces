import { type Component, For, Match, Switch } from "solid-js";
import { type MenuButtonItem, type MenuItems, MenuItemType } from "./lib/items.ts";
import UKDivider from "../divider/UKDivider.tsx";
import { DividerDirection } from "../divider/lib/direction.ts";
import clsx from "clsx";
import styles from "./UKMenu.module.scss";
import UKIcon from "../icon/UKIcon.tsx";

const UKMenu: Component<{
    items: MenuItems;
    class?: string;
}> = (props) => {
    return (
        <div class={clsx(styles.root, props.class)}>
            <For each={props.items}>
                {(item) => {
                    return (
                        <Switch>
                            <Match when={item.type === MenuItemType.Divider}>
                                <UKDivider direction={DividerDirection.Vertical} />
                            </Match>
                            <Match when={item.type === MenuItemType.Button}>
                                <button class={styles.buttonItem} onClick={(item as MenuButtonItem).onClick}>
                                    {(item as MenuButtonItem).leadingIcon && <UKIcon>{(item as MenuButtonItem).leadingIcon!}</UKIcon>}
                                    <div class={styles.label}>{(item as MenuButtonItem).label}</div>
                                    {(item as MenuButtonItem).trailing && (
                                        <Switch>
                                            <Match when={(item as MenuButtonItem).trailing?.type === "text"}>
                                                <div class={styles.trailingText}>{(item as MenuButtonItem).trailing!.value}</div>
                                            </Match>
                                            <Match when={(item as MenuButtonItem).trailing?.type === "icon"}>
                                                <UKIcon class={styles.trailingIcon}>{(item as MenuButtonItem).trailing!.value}</UKIcon>
                                            </Match>
                                        </Switch>
                                    )}
                                </button>
                            </Match>
                        </Switch>
                    );
                }}
            </For>
        </div>
    );
};

export default UKMenu;
