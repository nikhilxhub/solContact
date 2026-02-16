import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { ListItem } from '../../components/ListItem';
import { SectionDivider } from '../../components/SectionDivider';
import { Layout } from '../../constants/Layout';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function SettingsScreen() {
    const router = useRouter();
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    return (
        <ScreenContainer>
            <AppHeader title="Settings" showBack />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>Biometric Lock</Text>
                            <Text style={styles.sublabel}>Require FaceID to open</Text>
                        </View>
                        <Switch
                            value={biometricEnabled}
                            onValueChange={setBiometricEnabled}
                            trackColor={{ false: Colors.border, true: Colors.text }}
                            thumbColor={Colors.background}
                            ios_backgroundColor={Colors.border}
                        />
                    </View>
                    <SectionDivider />
                    <ListItem
                        label="Notifications"
                        showChevron
                        onPress={() => { }}
                    />
                    <ListItem
                        label="Privacy"
                        showChevron
                        onPress={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <ListItem
                        label="Help & Support"
                        showChevron
                        onPress={() => { }}
                    />
                    <ListItem
                        label="About Seeker"
                        value="v1.0.0"
                        onPress={() => { }}
                    />
                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: Layout.spacing.lg,
    },
    section: {
        marginBottom: Layout.spacing.xxl,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.md,
        minHeight: 56,
    },
    label: {
        ...Typography.styles.body,
        fontWeight: '500',
        color: Colors.text,
    },
    sublabel: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
