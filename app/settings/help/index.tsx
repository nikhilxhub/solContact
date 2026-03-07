import React, { useMemo } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { AppHeader } from '@/shared/components/AppHeader';
import { ListItem } from '@/shared/components/ListItem';
import { Colors } from '@/shared/theme/Colors';
import { Layout } from '@/shared/theme/Layout';
import { Typography } from '@/shared/theme/Typography';
import { useAppNetwork } from '@/features/settings/context/AppNetworkContext';

type FaqItem = {
    question: string;
    answer: string;
};

const SUPPORT_EMAIL = 'support@solcircle.app';

const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'Wallet is not connecting',
        answer: 'Make sure your wallet app is installed and unlocked, then try Connect Wallet again.',
    },
    {
        question: 'Transaction is pending or failed',
        answer: 'Check your selected network, balance, and wallet approval. Then retry the transfer.',
    },
    {
        question: 'Balances are not updating',
        answer: 'Use Refresh Balances in Send. Network congestion can delay updates briefly.',
    },
    {
        question: 'How Quick Pay templates work',
        answer: 'Templates store amount, token, and memo for faster repeat sends to the same contact.',
    },
    {
        question: 'How to delete data',
        answer: 'You can delete contacts and templates directly from their detail screens at any time.',
    },
];

export default function HelpSupportScreen() {
    const router = useRouter();
    const { networkLabel } = useAppNetwork();
    const appVersion = useMemo(() => Constants.expoConfig?.version ?? '1.0.0', []);

    const openSupportEmail = async (subject: string) => {
        const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
        try {
            const canOpen = await Linking.canOpenURL(mailtoUrl);
            if (!canOpen) {
                Alert.alert('Email unavailable', 'No email app is available on this device.');
                return;
            }
            await Linking.openURL(mailtoUrl);
        } catch (error) {
            console.error('Failed to open email app:', error);
            Alert.alert('Email unavailable', 'Could not open your email app.');
        }
    };

    const copyDebugInfo = async () => {
        const debugInfo = [
            `App: SolCircle`,
            `Version: ${appVersion}`,
            `Network: ${networkLabel}`,
            `Platform: ${Platform.OS} ${Platform.Version}`,
            `Storage: Contacts and templates are stored on-device`,
        ].join('\n');

        await Clipboard.setStringAsync(debugInfo);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Copied', 'Debug info copied to clipboard.');
    };

    return (
        <ScreenContainer>
            <AppHeader title="Help & Support" showBack />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <ListItem
                        label="Email support"
                        value={SUPPORT_EMAIL}
                        showChevron
                        onPress={() => openSupportEmail('SolCircle support request')}
                    />
                    <ListItem
                        label="Report a bug"
                        value="Include screenshot + steps"
                        showChevron
                        onPress={() => openSupportEmail('SolCircle bug report')}
                    />
                    <ListItem label="Copy debug info" showChevron onPress={copyDebugInfo} />
                    <ListItem
                        label="Read Privacy Policy"
                        showChevron
                        onPress={() => router.push('/settings/privacy')}
                    />
                </View>

                <View style={styles.safetyCard}>
                    <Text style={styles.safetyTitle}>Safety Notice</Text>
                    <Text style={styles.safetyText}>
                        We will never ask for your seed phrase or private keys. Do not share recovery phrases with
                        anyone.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick FAQ</Text>
                    <View style={styles.faqList}>
                        {FAQ_ITEMS.map((item) => (
                            <View key={item.question} style={styles.faqCard}>
                                <Text style={styles.faqQuestion}>{item.question}</Text>
                                <Text style={styles.faqAnswer}>{item.answer}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagnostics</Text>
                    <View style={styles.diagnosticsCard}>
                        <View style={styles.diagnosticRow}>
                            <Text style={styles.diagnosticLabel}>App Version</Text>
                            <Text style={styles.diagnosticValue}>{appVersion}</Text>
                        </View>
                        <View style={styles.diagnosticRow}>
                            <Text style={styles.diagnosticLabel}>Network</Text>
                            <Text style={styles.diagnosticValue}>{networkLabel}</Text>
                        </View>
                        <View style={styles.diagnosticRow}>
                            <Text style={styles.diagnosticLabel}>Storage</Text>
                            <Text style={styles.diagnosticValue}>On-device</Text>
                        </View>
                    </View>
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
        gap: Layout.spacing.lg,
    },
    section: {
        gap: Layout.spacing.sm,
    },
    sectionTitle: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '700',
    },
    safetyCard: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.radius.md,
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.md,
    },
    safetyTitle: {
        ...Typography.styles.body,
        color: Colors.text,
        fontWeight: '700',
    },
    safetyText: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        marginTop: Layout.spacing.xs,
    },
    faqList: {
        gap: Layout.spacing.sm,
    },
    faqCard: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.radius.md,
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.sm,
    },
    faqQuestion: {
        ...Typography.styles.body,
        color: Colors.text,
        fontWeight: '600',
    },
    faqAnswer: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        marginTop: Layout.spacing.xs,
    },
    diagnosticsCard: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.radius.md,
        backgroundColor: Colors.background,
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.sm,
        gap: Layout.spacing.xs,
    },
    diagnosticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.xs,
    },
    diagnosticLabel: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '700',
        fontSize: 11,
    },
    diagnosticValue: {
        ...Typography.styles.body,
        color: Colors.text,
        fontWeight: '500',
    },
});
