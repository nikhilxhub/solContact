import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';
import { createTable } from '../services/Database';
import { useEffect, useState } from 'react';

export default function RootLayout() {
    const [dbInitialized, setDbInitialized] = useState(false);

    useEffect(() => {
        createTable()
            .then(() => setDbInitialized(true))
            .catch(err => {
                console.error('Failed to create table:', err);
                // Still allow app to load even if DB fails, to avoid permanent white screen?
                // Or maybe show an error screen. For now, let's log and proceed potentially or just hang?
                // Better to set initialized to true so user can at least see UI, though it might be broken.
                setDbInitialized(true);
            });
    }, []);

    if (!dbInitialized) {
        return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="dark" backgroundColor={Colors.background} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                    animation: 'fade', // "Fade transitions" per requirements
                    animationDuration: 200,
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="home/index" />
                <Stack.Screen name="contact/add" />
                <Stack.Screen name="contact/[id]" />
                <Stack.Screen name="qr/generate" />
                <Stack.Screen name="qr/scan" />
                <Stack.Screen name="settings/index" />
            </Stack>
        </View>
    );
}
