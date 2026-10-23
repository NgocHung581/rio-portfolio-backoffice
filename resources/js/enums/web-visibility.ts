const WebVisibility = {
    Private: 0,
    Public: 1,
} as const;

export default WebVisibility;

export type WebVisibilityValue = (typeof WebVisibility)[keyof typeof WebVisibility];
