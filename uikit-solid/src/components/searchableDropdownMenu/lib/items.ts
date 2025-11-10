export enum SearchableDropdownMenuItemType {
    Button,
    Divider
}

export type SearchableDropDownMenuButtonItem = {
    type: SearchableDropdownMenuItemType.Button,
    leadingIcon?: string,
    label: string,
    trailing?: {
        type: "icon" | "text",
        value: string
    }
}

export type SearchableDropdownMenuDividerItem = {
    type: SearchableDropdownMenuItemType.Divider
}

export type SearchableDropdownMenuItem = SearchableDropDownMenuButtonItem | SearchableDropdownMenuDividerItem

export type SearchableDropdownMenuItems = SearchableDropdownMenuItem[];
