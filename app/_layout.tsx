import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
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
