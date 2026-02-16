import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { QRContainer } from '../../components/QRContainer';
import { PrimaryButton, TextButton } from '../../components/Buttons';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import * as Clipboard from 'expo-clipboard';

import { useLocalSearchParams } from 'expo-router';

export default function QRGenerateScreen() {
    const params = useLocalSearchParams();

    // Default to my identity if no params passed
    const defaultAddress = '71C7656EC7ab88b098defB751B7401B5f6d899A2';

    const isSharedContact = !!params.wallet;

    const qrData = isSharedContact ? JSON.stringify({
        name: params.name,
        phone: params.phone,
        wallet: params.wallet,
        skr: params.skr
    }) : defaultAddress;

    const displayAddress = isSharedContact ? (params.wallet as string) : defaultAddress;
    const displayName = isSharedContact ? (params.name as string) : 'My Identity';

    const handleCopy = async () => {
        await Clipboard.setStringAsync(displayAddress);
    };

    const handleShare = () => {
        // Share logic would go here
    };

    return (
        <ScreenContainer>
            <AppHeader title="Share Identity" showBack />
            <View style={styles.content}>
                <View style={styles.qrWrapper}>
                    <QRContainer value={qrData} displayValue={displayAddress} />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.instruction}>
                        {isSharedContact ? `Scan to add ${displayName}` : 'Scan to add to Seeker contacts'}
                    </Text>
                    <Text style={styles.addressDisplay} numberOfLines={1} ellipsizeMode="middle">
                        {displayAddress}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton title="Share" onPress={handleShare} />
                    <TextButton title="Copy Address" onPress={handleCopy} style={styles.copyButton} />
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: Layout.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrWrapper: {
        marginBottom: Layout.spacing.xl,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: Layout.spacing.xxl,
    },
    instruction: {
        ...Typography.styles.body,
        color: Colors.textSecondary,
        marginBottom: Layout.spacing.sm,
    },
    addressDisplay: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        maxWidth: 200,
    },
    actions: {
        width: '100%',
        gap: Layout.spacing.md,
    },
    copyButton: {
        marginTop: Layout.spacing.xs,
    },
});
