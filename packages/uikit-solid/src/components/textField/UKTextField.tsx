import { type Component, createSignal } from "solid-js";
import styles from "./UKTextField.module.scss";
import type { DOMElement } from "solid-js/jsx-runtime";

const UKTextField: Component<{
    color: "filled" | "outlined";
    leadingIcon?: string;
    labelEmpty?: string;
    label: string;
    trailingIcon?: string;
    supportingText?: string;
    getValue: (value: string) => void;
    onSubmit?: () => void;
    defaultValue?: string;
    maximumCharacterCount?: number;
    shouldMask?: boolean;
    as?: "textarea" | "input";
    error?: boolean;
}> = (props) => {
    const [characterLength, setCharacterLength] = createSignal<number>(0);

    if (props.defaultValue && props.defaultValue !== "") {
        setCharacterLength(props.defaultValue.length);
    }

    const elementProperties = {
        class: styles.input,
        onKeyUp: (
            e: KeyboardEvent & {
                currentTarget: HTMLInputElement | HTMLTextAreaElement;
                target: DOMElement;
            },
        ) => {
            setCharacterLength(e.currentTarget.value.length);

            props.getValue(e.currentTarget.value);
        },
        onSubmit: props.onSubmit,
        value: props.defaultValue,
        maxLength: props.maximumCharacterCount,
        type: props.shouldMask ? "password" : "text",
    };

    return (
        <div class={styles.container}>
            <div class={styles.root} data-error={props.error} data-color={props.color} data-populated={characterLength() > 0}>
                {props.as === "textarea" ? <textarea {...elementProperties} /> : <input {...elementProperties} />}
                <span class={styles.labelText}>
                    {props.labelEmpty !== undefined ? (characterLength() > 0 ? props.label : props.labelEmpty) : props.label}
                </span>
            </div>
            {(props.supportingText || props.maximumCharacterCount) && (
                <span data-error={props.error} class={styles.supportingText}>
                    <div>{props.supportingText}</div>
                    {props.maximumCharacterCount !== undefined && (
                        <div>
                            {characterLength()}/{props.maximumCharacterCount}
                        </div>
                    )}
                </span>
            )}
        </div>
    );
};

export default UKTextField;
