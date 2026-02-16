export interface Contact {
    id: string;
    name: string;
    phoneNumber?: string;
    walletAddress?: string;
    skrAddress?: string;
    resolvedWallet?: string;
    avatarUri?: string;
    notes?: string;
    addedVia?: 'manual' | 'qr';
    createdAt: number;
    updatedAt: number;
}
