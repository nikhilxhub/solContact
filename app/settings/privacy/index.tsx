import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { AppHeader } from '@/shared/components/AppHeader';
import { Colors } from '@/shared/theme/Colors';
import { Layout } from '@/shared/theme/Layout';
import { Typography } from '@/shared/theme/Typography';

const POLICY_SECTIONS = [
    {
        title: 'What We Store',
        body: 'Contact names, phone numbers, wallet addresses, notes, and payment templates are stored on your mobile device.',
    },
    {
        title: 'Local-Only Contacts',
        body: 'Your contacts and templates stay inside the app on your phone. We do not upload this contact data to external servers.',
    },
    {
        title: 'When Data Leaves The Device',
        body: 'Data is only shared outside the app when you choose actions such as sharing a contact, opening the dialer, scanning/generating QR, or sending a blockchain transaction.',
    },
    {
        title: 'Wallet And Blockchain Data',
        body: 'When you connect a wallet or send payments, transaction details are processed by your wallet provider and the Solana network.',
    },
    {
        title: 'Permissions',
        body: 'Camera is used for QR scanning. Clipboard is used for copy actions. Network access is used for blockchain and wallet operations.',
    },
    {
        title: 'Your Control',
        body: 'You can edit or delete contacts and templates at any time from inside the app.',
    },
    {
        title: 'Policy Updates',
        body: 'This policy may be updated when app features change. The latest version will always be shown on this screen.',
    },
];

export default function PrivacyPolicyScreen() {
    return (
        <ScreenContainer>
            <AppHeader title="Privacy Policy" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.effectiveDate}>Effective date: March 7, 2026</Text>
                <Text style={styles.intro}>
                    SolCircle is designed with a local-first approach. We keep personal contact data on your device
                    unless you explicitly choose to share or transmit it.
                </Text>

                <View style={styles.sections}>
                    {POLICY_SECTIONS.map((section) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionBody}>{section.body}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Layout.spacing.lg,
        paddingVertical: Layout.spacing.lg,
        paddingBottom: Layout.spacing.xxl,
    },
    effectiveDate: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '700',
    },
    intro: {
        ...Typography.styles.body,
        color: Colors.textSecondary,
        marginTop: Layout.spacing.sm,
    },
    sections: {
        marginTop: Layout.spacing.lg,
        gap: Layout.spacing.lg,
    },
    section: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.radius.md,
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.md,
        backgroundColor: Colors.background,
    },
    sectionTitle: {
        ...Typography.styles.caption,
        color: Colors.text,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '700',
    },
    sectionBody: {
        ...Typography.styles.body,
        color: Colors.textSecondary,
        marginTop: Layout.spacing.xs,
    },
});
