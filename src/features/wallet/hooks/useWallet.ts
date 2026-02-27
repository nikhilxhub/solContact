import { useCallback, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { useAppNetwork } from '@/features/settings/context/AppNetworkContext';
import { getWalletChain } from '@/features/wallet/services/network';
import { getWalletConnectMessage, getWalletErrorDetails } from '@/features/wallet/services/walletErrors';

type WalletAccountLike = {
    address?: PublicKey;
    publicKey?: PublicKey;
};

export function useWallet() {
    const { network, rpcEndpoint } = useAppNetwork();
    const walletChain = getWalletChain(network);
    const {
        account,
        connect: walletConnect,
        disconnect: walletDisconnect,
        signAndSendTransaction,
        connection,
    } = useMobileWallet();

    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    const publicKey = useMemo(() => {
        const current = account as WalletAccountLike | undefined;
        return current?.address || current?.publicKey;
    }, [account]);

    const walletAddress = publicKey?.toBase58();

    const connect = useCallback(async (): Promise<PublicKey> => {
        if (connecting) {
            throw new Error('Wallet connection already in progress');
        }

        try {
            setConnecting(true);
            console.log('Wallet connect attempt', {
                network,
                walletChain,
                rpcEndpoint,
            });

            const result = (await walletConnect()) as WalletAccountLike | undefined;
            const connectedPublicKey = result?.address || result?.publicKey;
            if (!connectedPublicKey) {
                throw new Error('Wallet connected without an account');
            }

            return connectedPublicKey;
        } finally {
            setConnecting(false);
        }
    }, [connecting, network, rpcEndpoint, walletChain, walletConnect]);

    const disconnect = useCallback(async () => {
        if (disconnecting) {
            return;
        }

        try {
            setDisconnecting(true);
            await walletDisconnect();
        } finally {
            setDisconnecting(false);
        }
    }, [disconnecting, walletDisconnect]);

    const ensureConnected = useCallback(async () => {
        if (publicKey) {
            return publicKey;
        }
        return connect();
    }, [connect, publicKey]);

    const getConnectErrorAlertMessage = useCallback((error: unknown) => {
        return `${getWalletConnectMessage(error)}\n\n${getWalletErrorDetails(error)}`;
    }, []);

    const getDisconnectErrorAlertMessage = useCallback((error: unknown) => {
        return getWalletErrorDetails(error);
    }, []);

    return {
        connection,
        signAndSendTransaction,
        network,
        rpcEndpoint,
        walletChain,
        publicKey,
        walletAddress,
        connected: Boolean(publicKey),
        connecting,
        disconnecting,
        connect,
        disconnect,
        ensureConnected,
        getConnectErrorAlertMessage,
        getDisconnectErrorAlertMessage,
    };
}
