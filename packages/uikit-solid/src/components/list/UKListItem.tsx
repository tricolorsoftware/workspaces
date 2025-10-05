import { type Component } from "solid-js";
import UKIcon from "../icon/UKIcon.tsx";
import styles from "./UKListItem.module.scss"

const UKListItem: Component<{
    labelText: string;
    supportingText: string;
    trailing?: {
        type: "icon" | "text";
        value: string;
    };
    lines?: 1 | 2 | 3;
    leading?: {
        type: "image" | "avatar" | "icon" | "video" | "large-image";
        value: string;
        alt?: string;
    };
    onClick: () => void;
    selected?: boolean;
    canSelect?: boolean;
    divider?: boolean;
    disabled?: boolean;
}> = (props) => {
    return (
        <div
            class={styles.root}
            data-disabled={props.disabled}
            data-lines={props.lines || 2}
            data-selected={props.selected}
            data-can-select={props.canSelect}
            data-divider={props.divider}
            onClick={props.onClick}
            tabindex={props.disabled ? undefined : 0}
        >
            {props.leading?.type === "icon" && (
                <UKIcon class={styles.leadingIcon}>{props.leading.value}</UKIcon>
            )}
            {props.leading?.type === "image" && (
                <img class={styles.leadingImage} src={props.leading.value} alt={props.leading.alt || ""} />
            )}
            {props.leading?.type === "avatar" && (
                <div class={styles.leadingAvatar}>
                    <span>{(props.leading.alt || "uk").slice(0, 2)}</span>
                    <img src={props.leading.value} alt={props.leading.alt || ""} />
                </div>
            )}
            <div class={styles.body}>
                <div class={styles.labelText}>{props.labelText}</div>
                <p class={styles.supportingText}>{props.supportingText}</p>
            </div>
            {props.trailing?.type === "icon" && (
                <UKIcon class={styles.trailingIcon}>{props.trailing.value}</UKIcon>
            )}
            {props.trailing?.type === "text" && (
                <span class={styles.trailingText}>{props.trailing.value}</span>
            )}
        </div>
    );
};

export default UKListItem;
