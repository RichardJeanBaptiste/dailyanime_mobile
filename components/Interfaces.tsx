export interface QuoteLogItem {
    char_name : string;
    anime: string;
    img_links: any;
    quote: string;
    biography: string;
    wiki: string;
}

export interface ModalInfo {
    currentQuote: any,
    modalVisible: boolean,
    setVisible: () => void
}