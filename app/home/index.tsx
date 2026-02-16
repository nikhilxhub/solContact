import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { ContactCard } from '../../components/ContactCard';
import { Layout } from '../../constants/Layout';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ContactRepository } from '../../repositories/ContactRepository';
import { Contact } from '../../types';



export default function HomeScreen() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const data = await ContactRepository.getAllContacts();
            setContacts(data);
        } catch (error) {
            console.error('Failed to load contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadContacts();
        }, [])
    );

    const handleAddPress = () => {
        router.push('/contact/add');
    };

    const handleContactPress = (id: string) => {
        router.push(`/contact/${id}`);
    };

    const handleSettingsPress = () => {
        router.push('/settings');
    };

    return (
        <ScreenContainer>
            <AppHeader
                title="Contacts"
                rightAction={
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}>
                            <Ionicons name="settings-sharp" size={24} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/qr/scan')} style={[styles.iconButton, { marginLeft: Layout.spacing.md }]}>
                            <Ionicons name="scan-outline" size={24} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddPress} style={[styles.iconButton, { marginLeft: Layout.spacing.md }]}>
                            <Ionicons name="add" size={28} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                }
            />
            {loading ? (
                <View style={[styles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.text} />
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ContactCard
                            name={item.name}
                            detail={item.skrAddress || item.walletAddress || item.phoneNumber || 'No details'}
                            onPress={() => handleContactPress(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={{ paddingTop: 50, alignItems: 'center' }}>
                            <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                        </View>
                    }
                />
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: Layout.spacing.md,
        paddingTop: Layout.spacing.sm,
        paddingBottom: Layout.spacing.xxl,
    },
    iconButton: {
        padding: 4,
    },
    container: {
        flex: 1,
    },
});
