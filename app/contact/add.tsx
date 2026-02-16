import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { Layout } from '../../constants/Layout';
import { InputField } from '../../components/InputField';
import { PrimaryButton, TextButton } from '../../components/Buttons';
import { Colors } from '../../constants/Colors';

export default function AddContactScreen() {
    const router = useRouter();

    const handleSave = () => {
        // Logic would go here
        router.back();
    };

    return (
        <ScreenContainer>
            <AppHeader title="Add Contact" showBack />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <InputField label="Name" placeholder="Enter name" autoFocus />
                <InputField label="Phone" placeholder="+1 234 567 8900" keyboardType="phone-pad" />
                <InputField label="Wallet Address" placeholder="0x..." />
                <InputField label=".skr Address" placeholder="username.skr" autoCapitalize="none" />
                <InputField
                    label="Notes"
                    placeholder="Additional details"
                    multiline
                    style={{ height: 80, textAlignVertical: 'top' }}
                />

                <View style={styles.actions}>
                    <PrimaryButton title="Save Contact" onPress={handleSave} />
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
