export interface Advertisement {
    id: string;
    title: string;
    subtitle?: string | null;
    image_url: string;
    link?: string | null;
    button_text?: string | null;
    active: boolean;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}
