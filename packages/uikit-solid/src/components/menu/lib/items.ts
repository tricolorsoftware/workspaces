export enum MenuItemType {
    Button,
    Divider
}

export type MenuButtonItem = {
    type: MenuItemType.Button,
    leadingIcon?: string,
    label: string,
    trailing?: {
        type: "icon" | "text",
        value: string
    },
    onClick(): void
}

export type MenuDividerItem = {
    type: MenuItemType.Divider
}

export type MenuItem = MenuButtonItem | MenuDividerItem

export type MenuItems = MenuItem[];
