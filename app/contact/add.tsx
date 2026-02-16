import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { Layout } from '../../constants/Layout';
import { InputField } from '../../components/InputField';
import { PrimaryButton, TextButton } from '../../components/Buttons';
import { Colors } from '../../constants/Colors';
import { ContactRepository } from '../../repositories/ContactRepository';
import { Contact } from '../../types';

export default function AddContactScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [wallet, setWallet] = useState('');
    const [skr, setSkr] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (params.walletAddress) {
            setWallet(params.walletAddress as string);
        }
        if (params.name) {
            setName(params.name as string);
        }
        if (params.phone) {
            setPhone(params.phone as string);
        }
        if (params.skrAddress) {
            setSkr(params.skrAddress as string);
        }
    }, [params]);

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Name is required');
            return;
        }

        try {
            setIsSubmitting(true);
            const newContact: Contact = {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                name: name.trim(),
                phoneNumber: phone.trim(),
                walletAddress: wallet.trim(),
                skrAddress: skr.trim(),
                notes: notes.trim(),
                addedVia: 'manual',
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            await ContactRepository.addContact(newContact);
            router.back();
        } catch (error) {
            console.error('Failed to save contact:', error);
            alert('Failed to save contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenContainer>
            <AppHeader title="Add Contact" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <InputField
                    label="Name"
                    placeholder="Enter name"
                    autoFocus
                    value={name}
                    onChangeText={setName}
                />
                <InputField
                    label="Phone"
                    placeholder="+1 234 567 8900"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <InputField
                    label="Wallet Address"
                    placeholder="0x..."
                    value={wallet}
                    onChangeText={setWallet}
                />
                <InputField
                    label=".skr Address"
                    placeholder="username.skr"
                    autoCapitalize="none"
                    value={skr}
                    onChangeText={setSkr}
                />
                <InputField
                    label="Notes"
                    placeholder="Additional details"
                    multiline
                    style={{ height: 80, textAlignVertical: 'top' }}
                    value={notes}
                    onChangeText={setNotes}
                />

                <View style={styles.actions}>
                    <PrimaryButton
                        title={isSubmitting ? "Saving..." : "Save Contact"}
                        onPress={handleSave}
                        disabled={isSubmitting}
                    />
                    <TextButton
                        title="Cancel"
                        onPress={() => router.back()}
                        style={styles.cancelButton}
                        disabled={isSubmitting}
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: Layout.spacing.lg,
    },
    actions: {
        marginTop: Layout.spacing.xl,
        gap: Layout.spacing.md,
    },
    cancelButton: {
        marginTop: Layout.spacing.xs,
    },
});
