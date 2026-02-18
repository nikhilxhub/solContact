import { View, Text, StyleSheet, ScrollView, Linking, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton, TextButton, IconActionButton } from '../../components/Buttons';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { ContactRepository } from '../../repositories/ContactRepository';
import { Contact } from '../../types';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

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

    if (loading || !contact) {
        return (
            <ScreenContainer>
                <AppHeader title="" showBack />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{loading ? 'Loading...' : 'Contact not found'}</Text>
                </View>
            </ScreenContainer>
        );
    }

    const handleEdit = () => {
        router.push(`/contact/edit/${id}`);
    };

    const handleShare = () => {
        router.push({
            pathname: '/qr/generate',
            params: {
                name: contact.name,
                phone: contact.phoneNumber || '',
                wallet: contact.walletAddress || '',
                skr: contact.skrAddress || ''
            }
        });
    };

    const handleCall = () => {
        if (!contact.phoneNumber) {
            Alert.alert('Error', 'No phone number available');
            return;
        }
        const url = `tel:${contact.phoneNumber}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) Linking.openURL(url);
            else Alert.alert('Error', 'Phone dialer not available');
        });
    };

    const handleSend = () => {
        Alert.alert('Send Action', 'This feature is coming soon.');
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${contact.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ContactRepository.deleteContact(id as string);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            router.replace('/home');
                        } catch (error) {
                            console.error('Failed to delete contact:', error);
                            Alert.alert('Error', 'Failed to delete contact. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleCopy = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Alert.alert('Copied', `${label} copied to clipboard`);
    };

    return (
        <ScreenContainer>
            <AppHeader
                title=""
                showBack
                rightAction={<TextButton title="Edit" onPress={handleEdit} />}
            />
            <ScrollView contentContainerStyle={styles.content}>

                {/* 1. Identity Section (Top) */}
                <View style={styles.identitySection}>
                    <Avatar name={contact.name} size={100} />
                    <Text style={styles.name}>{contact.name}</Text>
                    {contact.skrAddress && (
                        <Text style={styles.handle}>@{contact.skrAddress.replace('seeker:', '')}</Text>
                    )}
                </View>

                {/* 2. Hero Actions (Golden Zone) */}
                <View style={styles.heroActions}>
                    <IconActionButton
                        icon={<Ionicons name="call" size={28} color={Colors.background} />}
                        label="Call"
                        onPress={handleCall}
                        style={styles.heroButtonPrimary}
                        labelStyle={styles.heroLabel}
                    />
                    <IconActionButton
                        icon={<Ionicons name="paper-plane" size={28} color={Colors.text} />}
                        label="Pay"
                        onPress={handleSend}
                        style={styles.heroButtonSecondary}
                        labelStyle={styles.heroLabelSecondary}
                    />
                </View>

                {/* 3. Minimal Details (Bottom) */}
                <View style={styles.detailsSection}>
                    {contact.phoneNumber && (
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() => handleCopy(contact.phoneNumber!, 'Mobile Number')}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.infoLabel}>MOBILE</Text>
                            <Text style={styles.infoValue}>{contact.phoneNumber}</Text>
                        </TouchableOpacity>
                    )}
                    {contact.walletAddress && (
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() => handleCopy(contact.walletAddress!, 'Wallet Address')}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.infoLabel}>WALLET</Text>
                            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                                {contact.walletAddress}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {contact.notes && (
                        <View style={styles.notesContainer}>
                            <Text style={styles.infoLabel}>NOTES</Text>
                            <Text style={styles.notesValue}>{contact.notes}</Text>
                        </View>
                    )}
                </View>

                {/* 4. Footer Actions */}
                <View style={styles.footerActions}>
                    <TextButton title="Share Contact" onPress={handleShare} style={styles.footerButton} />
                    <TextButton
                        title="Delete"
                        onPress={handleDelete}
                        style={styles.footerButton}
                        labelStyle={{ color: Colors.error || '#FF3B30' }}
                    />
                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingHorizontal: Layout.spacing.xl,
        paddingBottom: Layout.spacing.xxl,
    },
    // Identity
    identitySection: {
        alignItems: 'center',
        marginTop: Layout.spacing.lg,
        marginBottom: Layout.spacing.xl,
    },
    name: {
        ...Typography.styles.title,
        fontSize: 32,
        marginTop: Layout.spacing.md,
        fontWeight: '700',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    handle: {
        ...Typography.styles.body,
        color: Colors.textTertiary,
        marginTop: 4,
        fontSize: 16,
    },

    // Hero Actions
    heroActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Layout.spacing.xl, // Space between buttons
        marginBottom: Layout.spacing.xxl,
    },
    heroButtonPrimary: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.text, // Black background
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    heroButtonSecondary: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.background, // White background
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    heroLabel: {
        marginTop: 8,
        fontWeight: '600',
        color: Colors.text,
    },
    heroLabelSecondary: {
        marginTop: 8,
        fontWeight: '600',
        color: Colors.text,
    },

    // Details - Clean List
    detailsSection: {
        marginBottom: Layout.spacing.xxl,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Layout.spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    infoLabel: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        fontWeight: '700',
        letterSpacing: 1,
        fontSize: 11,
    },
    infoValue: {
        ...Typography.styles.body,
        fontWeight: '500',
        color: Colors.text,
        textAlign: 'right',
        maxWidth: '70%',
    },
    notesContainer: {
        marginTop: Layout.spacing.lg,
    },
    notesValue: {
        ...Typography.styles.body,
        color: Colors.textSecondary,
        marginTop: Layout.spacing.sm,
        lineHeight: 22,
    },

    // Footer
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 'auto', // Push to bottom if content is short
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.border,
        paddingTop: Layout.spacing.lg,
    },
    footerButton: {
        paddingHorizontal: Layout.spacing.lg,
    },
});
