import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';
import { createTable } from '../services/Database';
import { useEffect, useState } from 'react';
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js';
import { AppNetworkProvider, useAppNetwork } from '../contexts/AppNetworkContext';
import { getWalletChain } from '../services/network';

const APP_IDENTITY = {
    name: 'SolContact',
    ...(process.env.EXPO_PUBLIC_APP_IDENTITY_URI ? { uri: process.env.EXPO_PUBLIC_APP_IDENTITY_URI } : {}),
    ...(process.env.EXPO_PUBLIC_APP_IDENTITY_ICON ? { icon: process.env.EXPO_PUBLIC_APP_IDENTITY_ICON } : {}),
};

function AppNavigationStack() {
    const { network, rpcEndpoint } = useAppNetwork();
    const walletChain = getWalletChain(network);

    return (
        <MobileWalletProvider chain={walletChain} endpoint={rpcEndpoint} identity={APP_IDENTITY}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                    animation: 'fade',
                    animationDuration: 200,
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="home/index" />
                <Stack.Screen name="contact/add" />
                <Stack.Screen name="contact/[id]" />
                <Stack.Screen name="contact/edit/[id]" />
                <Stack.Screen name="qr/generate" />
                <Stack.Screen name="qr/scan" />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/profile/index" />
                <Stack.Screen name="settings/profile/edit" />
            </Stack>
        </MobileWalletProvider>
    );
}

export default function RootLayout() {
    const [dbInitialized, setDbInitialized] = useState(false);

    useEffect(() => {
        createTable()
            .then(() => setDbInitialized(true))
            .catch((err) => {
                console.error('Failed to create table:', err);
                setDbInitialized(true);
            });
    }, []);

    if (!dbInitialized) {
        return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
    }

    return (
        <AppNetworkProvider>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <StatusBar style="dark" backgroundColor={Colors.background} />
                <AppNavigationStack />
            </View>
        </AppNetworkProvider>
    );
}
