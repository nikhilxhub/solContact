import { clusterApiUrl } from '@solana/web3.js';
import { NetworkType } from '../types';

export function getRpcEndpoint(network: NetworkType): string {
    if (network === 'mainnet-beta') {
        return process.env.EXPO_PUBLIC_SOLANA_RPC_MAINNET || clusterApiUrl('mainnet-beta');
    }

    return process.env.EXPO_PUBLIC_SOLANA_RPC_DEVNET || clusterApiUrl('devnet');
}

export function getExplorerTxUrl(signature: string, network: NetworkType): string {
    const base = `https://explorer.solana.com/tx/${signature}`;
    if (network === 'mainnet-beta') {
        return base;
    }
    return `${base}?cluster=devnet`;
}

export function getNetworkLabel(network: NetworkType): string {
    return network === 'mainnet-beta' ? 'Mainnet' : 'Devnet';
}
