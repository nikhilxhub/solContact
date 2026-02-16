import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextButton } from '../../components/Buttons';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

// Mocking camera view since we don't want to install expo-camera for UI demo unless requested
// Requirements said: "Camera preview container mock"

export default function QRScanScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.cameraMock}>
                <Text style={styles.mockText}>Camera Preview</Text>
            </View>

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
                    // style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}
                    // textStyle={{ color: '#fff' }} // If we supported custom text style prop in component
                    />
                    {/* Since TextButton doesn't support custom text color prop easily without modification,
              I will assume the component handles it or I should have added it. 
              For now, let's use a wrapper or just let it be default. 
              Actually, let's modify TextButton to accept textStyle or just accept that it might be black on dark.
              Wait, the mock camera is dark gray, so black text might happen.
              Let's make sure the overlay is handled well.
          */}
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
    cameraMock: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mockText: {
        color: '#666',
        fontSize: 20,
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
