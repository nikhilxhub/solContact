import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { Avatar } from '../../components/Avatar';
import { ListItem } from '../../components/ListItem';
import { SectionDivider } from '../../components/SectionDivider';
import { PrimaryButton, TextButton, IconActionButton } from '../../components/Buttons';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function ContactDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Mock data fetching based on ID
    const contact = {
        id: id,
        name: 'Alex V.',
        phone: '+1 555 019 2834',
        wallet: '71C7656EC7ab88b098defB751B7401B5f6d899A2',
        skr: 'alex.skr',
        notes: 'Met at SOL Denver. Developer at Foundation.',
    };

    const handleEdit = () => {
        router.push(`/contact/edit/${id}`);
    };

    const handleShare = () => {
        router.push('/qr/generate');
    };

    const handleCall = () => {
        const url = `tel:${contact.phone}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Phone dialer not available');
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const handleSend = () => {
        // Placeholder for crypto send or message
        Alert.alert('Send Action', 'This feature is coming soon.');
    };

    return (
        <ScreenContainer>
            <AppHeader
                title=""
                showBack
                rightAction={
                    <TextButton title="Edit" onPress={handleEdit} />
                }
            />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Avatar name={contact.name} size={80} />
                    <Text style={styles.name}>{contact.name}</Text>

                    <View style={styles.actionRow}>
                        <IconActionButton
                            icon={<Ionicons name="call" size={24} color={Colors.text} />}
                            label="Call"
                            onPress={handleCall}
                            style={{ marginRight: Layout.spacing.lg }}
                        />
                        <IconActionButton
                            icon={<Ionicons name="paper-plane" size={24} color={Colors.text} />}
                            label="Send"
                            onPress={handleSend}
                        />
                    </View>
                </View>

                <SectionDivider style={styles.divider} />

                <View style={styles.section}>
                    <ListItem
                        label="Phone"
                        value={contact.phone}
                        onPress={() => { }}
                        icon="call-outline"
                    />
                    <ListItem
                        label="Wallet"
                        value={contact.wallet}
                        onPress={() => { }} // Copy action mock
                        icon="wallet-outline"
                    />
                    <ListItem
                        label=".skr"
                        value={contact.skr}
                        onPress={() => { }}
                        icon="at-outline"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <Text style={styles.notesText}>{contact.notes}</Text>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton
                        title="Share Contact"
                        onPress={handleShare}
                        style={styles.shareButton}
                    />
                    <TextButton
                        title="Delete Contact"
                        onPress={() => router.back()}
                        style={{ marginTop: Layout.spacing.md }}
                    // textStyle={{ color: Colors.error }} // If we had error color prop
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: Layout.spacing.lg,
        paddingTop: Layout.spacing.sm,
    },
    header: {
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
    },
    name: {
        ...Typography.styles.title,
        marginTop: Layout.spacing.md,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: Layout.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        marginVertical: Layout.spacing.lg,
    },
    section: {
        marginBottom: Layout.spacing.xl,
    },
    sectionTitle: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        marginBottom: Layout.spacing.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    notesText: {
        ...Typography.styles.body,
        color: Colors.text,
        lineHeight: 24,
    },
    actions: {
        marginTop: Layout.spacing.xl,
    },
    shareButton: {
        width: '100%',
    },
});
