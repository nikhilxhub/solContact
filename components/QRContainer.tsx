import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { Typography } from '../constants/Typography';

// In a real app, we'd use 'react-native-qrcode-svg', but for UI demo we'll make a placeholder style
// block that looks like a QR code container.
// If the user installed a QR lib we could use it, but "No unnecessary third-party UI libraries" implies
// keeping it simple, though 'react-native-qrcode-svg' is standard for functionality.
// For the purpose of "Visual Design Demo", I will create a placeholder visual.

interface QRContainerProps {
    value: string;
}

export const QRContainer: React.FC<QRContainerProps> = ({ value }) => {
    return (
        <View style={styles.container}>
            <View style={styles.qrPlaceholder}>
                <View style={[styles.finder, styles.topLeft]} />
                <View style={[styles.finder, styles.topRight]} />
                <View style={[styles.finder, styles.bottomLeft]} />
                <View style={styles.codePattern} />
            </View>
            <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="middle">
                {value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Layout.spacing.xl,
        backgroundColor: Colors.background,
        borderRadius: Layout.radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    qrPlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: '#fff', // QR is always on white
        position: 'relative',
    },
    finder: {
        width: 40,
        height: 40,
        borderWidth: 4,
        borderColor: '#000',
        position: 'absolute',
        backgroundColor: '#fff',
        zIndex: 2,
    },
    // Inner square of finder
    topLeft: { top: 0, left: 0 },
    topRight: { top: 0, right: 0 },
    bottomLeft: { bottom: 0, left: 0 },
    codePattern: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        backgroundColor: '#000',
        opacity: 0.1, // Simulate data
        borderRadius: 4,
    },
    valueText: {
        marginTop: Layout.spacing.md,
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        maxWidth: 200,
    },
});
