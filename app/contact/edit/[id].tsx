import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { AppHeader } from '../../../components/AppHeader';
import { Layout } from '../../../constants/Layout';
import { InputField } from '../../../components/InputField';
import { PrimaryButton, TextButton } from '../../../components/Buttons';

export default function EditContactScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // In a real app, useQuery or useEffect to fetch data
    const contact = {
        name: 'Alex V.',
        phone: '+1 555 019 2834',
        wallet: '71C7656EC7ab88b098defB751B7401B5f6d899A2',
        skr: 'alex.skr',
        notes: 'Met at SOL Denver. Developer at Foundation.',
    };

    const handleSave = () => {
        router.back();
    };

    return (
        <ScreenContainer>
            <AppHeader title="Edit Contact" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <InputField label="Name" defaultValue={contact.name} />
                <InputField label="Phone" defaultValue={contact.phone} keyboardType="phone-pad" />
                <InputField label="Wallet Address" defaultValue={contact.wallet} />
                <InputField label=".skr Address" defaultValue={contact.skr} autoCapitalize="none" />
                <InputField
                    label="Notes"
                    defaultValue={contact.notes}
                    multiline
                    style={{ height: 80, textAlignVertical: 'top' }}
                />

                <View style={styles.actions}>
                    <PrimaryButton title="Save Changes" onPress={handleSave} />
                    <TextButton
                        title="Cancel"
                        onPress={() => router.back()}
                        style={styles.cancelButton}
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
