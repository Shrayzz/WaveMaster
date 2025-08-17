interface Window {
    wmAPI: {
        getGlobalValues: () => Promise<any>;
        addMusic: (url: string) => Promise<{ success: boolean; message: string }>;
        loadMusic: () => Promise<{ data: Array; success: boolean; message: string }>;
        removeMusic: (url: string) => Promise<{ success: boolean; message: string }>;
    };
}