import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextButton } from '../../components/Buttons';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function QRScanScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <View style={[styles.messageContainer, { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                    <Text style={[styles.message, { color: 'white', marginBottom: 20, textAlign: 'center' }]}>
                        We need your permission to show the camera
                    </Text>
                    <Button onPress={requestPermission} title="grant permission" />
                </View>
            </View>
        );
    }

    const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);

        try {
            const parsedData = JSON.parse(data);
            // Check if it looks like our contact object
            if (parsedData.wallet || parsedData.name) {
                router.push({
                    pathname: '/contact/add',
                    params: {
                        name: parsedData.name || '',
                        phone: parsedData.phone || '',
                        walletAddress: parsedData.wallet || '',
                        skrAddress: parsedData.skr || ''
                    }
                });
                return;
            }
        } catch (e) {
            // Not JSON, treat as plain wallet address
        }

        router.push({
            pathname: '/contact/add',
            params: { walletAddress: data }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            <View style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.title}>Scan QR Code</Text>
                    <Text style={styles.subtitle}>Align code within the frame</Text>
                </View>

                <View style={styles.scanFrameContainer}>
                    <View style={styles.scanFrame} />
                </View>

                <View style={styles.footer}>
                    <TextButton
                        title="Cancel"
                        onPress={() => router.back()}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginTop: Layout.spacing.xl,
    },
    title: {
        ...Typography.styles.title,
        color: '#fff',
        marginBottom: Layout.spacing.xs,
    },
    subtitle: {
        ...Typography.styles.body,
        color: '#ccc',
    },
    scanFrameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: Layout.radius.lg,
        backgroundColor: 'transparent',
    },
    footer: {
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
    },
});
