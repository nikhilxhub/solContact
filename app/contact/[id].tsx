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

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ContactRepository } from '../../repositories/ContactRepository';
import { Contact } from '../../types';

export default function ContactDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (id) {
                loadContact(id as string);
            }
        }, [id])
    );

    const loadContact = async (contactId: string) => {
        try {
            setLoading(true);
            const data = await ContactRepository.getContactById(contactId);
            setContact(data);
        } catch (error) {
            console.error('Failed to load contact:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ScreenContainer>
                <AppHeader title="" showBack />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (!contact) {
        return (
            <ScreenContainer>
                <AppHeader title="" showBack />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Contact not found</Text>
                </View>
            </ScreenContainer>
        );
    }

    const handleEdit = () => {
        router.push(`/contact/edit/${id}`);
    };

    const handleShare = () => {
        router.push('/qr/generate');
    };

    const handleCall = () => {
        if (!contact.phoneNumber) {
            Alert.alert('Error', 'No phone number available');
            return;
        }
        const url = `tel:${contact.phoneNumber}`;
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
                        value={contact.phoneNumber}
                        onPress={() => { }}
                        icon="call-outline"
                    />
                    <ListItem
                        label="Wallet"
                        value={contact.walletAddress}
                        onPress={() => { }} // Copy action mock
                        icon="wallet-outline"
                    />
                    <ListItem
                        label=".skr"
                        value={contact.skrAddress}
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
