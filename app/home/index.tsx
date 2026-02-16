import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { ContactCard } from '../../components/ContactCard';
import { Layout } from '../../constants/Layout';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const MOCK_CONTACTS = [
    { id: '1', name: 'Alex V.', detail: '71C...9A2' },
    { id: '2', name: 'Sarah Chen', detail: '+1 555 019 2834' },
    { id: '3', name: 'David K.', detail: 'david.skr' },
    { id: '4', name: 'Elena R.', detail: '33D...1B4' },
    { id: '5', name: 'James W.', detail: '+44 7700 900077' },
    { id: '6', name: 'Priya P.', detail: 'priya.skr' },
    { id: '7', name: 'Marcus T.', detail: '99A...2C1' },
    { id: '8', name: 'Linda B.', detail: '+1 202 555 0171' },
];

export default function HomeScreen() {
    const router = useRouter();

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
                        <TouchableOpacity onPress={() => { }} style={[styles.iconButton, { marginLeft: Layout.spacing.md }]}>
                            <Ionicons name="scan-outline" size={24} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddPress} style={[styles.iconButton, { marginLeft: Layout.spacing.md }]}>
                            <Ionicons name="add" size={28} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                }
            />
            <FlatList
                data={MOCK_CONTACTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ContactCard
                        name={item.name}
                        detail={item.detail}
                        onPress={() => handleContactPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
});
