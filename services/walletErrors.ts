export function getWalletErrorCode(error: unknown): string | undefined {
    if (!error || typeof error !== 'object') {
        return undefined;
    }

    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') {
        return code;
    }
    if (typeof code === 'number') {
        return String(code);
    }
    return undefined;
}

export function getWalletErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
        return '';
    }

    const message = (error as { message?: unknown }).message;
    return typeof message === 'string' ? message : '';
}

export function getWalletErrorDetails(error: unknown): string {
    if (!error || typeof error !== 'object') {
        return 'Unknown wallet error';
    }

    const name = typeof (error as { name?: unknown }).name === 'string' ? (error as { name: string }).name : 'Error';
    const code = getWalletErrorCode(error) || 'unknown';
    const message =
        typeof (error as { message?: unknown }).message === 'string'
            ? (error as { message: string }).message
            : 'Unknown message';

    return `${name} (${code}): ${message}`;
}

export function getWalletConnectMessage(error: unknown): string {
    const code = getWalletErrorCode(error);
    const message = getWalletErrorMessage(error);

    if (code === 'ERROR_WALLET_NOT_FOUND') {
        return 'No compatible Solana wallet was found. Install or enable a Mobile Wallet Adapter wallet.';
    }

    if (code === 'ERROR_SESSION_TIMEOUT') {
        return 'Wallet session timed out. Re-open wallet and approve quickly, then try again.';
    }

    if (code === 'ERROR_AUTHORIZATION_FAILED' || code === '-1') {
        return 'Wallet authorization was rejected or expired. Please approve the connection request in wallet app.';
    }

    if (code === 'ERROR_ATTEST_ORIGIN_ANDROID' || code === '-100') {
        return 'Wallet rejected app identity attestation. Use a wallet that supports dev builds, or set verified app identity values.';
    }

    if (code === 'EUNSPECIFIED' && message.includes('CancellationException')) {
        return 'Wallet canceled the connection session before authorization completed. Open wallet, approve quickly, and return to this app.';
    }

    return 'Could not connect to a mobile wallet.';
}
