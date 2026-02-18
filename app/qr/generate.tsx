import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '../../components/ScreenContainer';
import { AppHeader } from '../../components/AppHeader';
import { PrimaryButton, TextButton } from '../../components/Buttons';
import { Avatar } from '../../components/Avatar';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { UserProfileRepository } from '../../repositories/UserProfileRepository';

const { width } = Dimensions.get('window');

export default function QRGenerateScreen() {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState('');
    const [displayData, setDisplayData] = useState({
        name: '',
        wallet: '',
        handle: '',
        phone: ''
    });

    const isSharedContact = !!params.wallet || !!params.name;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            if (isSharedContact) {
                // Formatting data from params (Shared Contact)
                const data = {
                    name: params.name as string,
                    phone: params.phone as string || '',
                    wallet: params.wallet as string || '',
                    skrAddress: params.skr as string || '',
                    type: 'contact_card'
                };
                setQrData(JSON.stringify(data));
                setDisplayData({
                    name: data.name,
                    wallet: data.wallet,
                    handle: data.skrAddress ? data.skrAddress.replace('seeker:', '') : '',
                    phone: data.phone
                });
            } else {
                // Loading My Profile (My Identity)
                const profile = await UserProfileRepository.getProfile();
                if (profile) {
                    const data = {
                        name: profile.name || '',
                        phoneNumber: profile.phoneNumber || '',
                        walletAddress: profile.walletAddress || '',
                        skrAddress: profile.skrAddress || '',
                        type: 'contact_card'
                    };
                    setQrData(JSON.stringify(data));
                    setDisplayData({
                        name: profile.name || 'My Identity',
                        wallet: profile.walletAddress || '',
                        handle: profile.skrAddress ? profile.skrAddress.replace('seeker:', '') : '',
                        phone: profile.phoneNumber || ''
                    });
                } else {
                    // Fallback if no profile exists
                    const data = {
                        name: 'My Identity',
                        wallet: '',
                        type: 'contact_card'
                    };
                    setQrData(JSON.stringify(data));
                    setDisplayData({
                        name: 'My Identity',
                        wallet: '',
                        handle: '',
                        phone: ''
                    });
                }
            }
        } catch (error) {
            console.error('Failed to generate QR data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (displayData.wallet) {
            await Clipboard.setStringAsync(displayData.wallet);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleShare = () => {
        // Share logic placeholder
    };

    if (loading) {
        return (
            <ScreenContainer>
                <AppHeader title="Share Identity" showBack />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.text} />
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <AppHeader title="Share Identity" showBack />
            <ScrollView contentContainerStyle={styles.content}>

                {/* 1. Identity Section (Top) */}
                <View style={styles.identitySection}>
                    <Avatar name={displayData.name} size={80} />
                    <Text style={styles.name}>{displayData.name}</Text>
                    {!!displayData.handle && (
                        <Text style={styles.handle}>@{displayData.handle}</Text>
                    )}
                </View>

                {/* 2. QR Section (Middle / Golden Zone) */}
                <View style={styles.qrSection}>
                    <QRCode
                        value={qrData}
                        size={width * 0.65} // Large and center
                        color={Colors.text}
                        backgroundColor={Colors.background}
                        quietZone={10}
                    />
                    <Text style={styles.qrHelper}>
                        {isSharedContact ? `Scan to add` : 'Scan to connect'}
                    </Text>
                </View>

                {/* 3. Details (Bottom) */}
                <View style={styles.detailsSection}>
                    {!!displayData.wallet && (
                        <>
                            <Text style={styles.addressLabel}>WALLET ADDRESS</Text>
                            <Text style={styles.addressValue} numberOfLines={1} ellipsizeMode="middle">
                                {displayData.wallet}
                            </Text>
                        </>
                    )}
                </View>

                {/* 4. Actions (Footer) */}
                <View style={styles.actionSection}>
                    <PrimaryButton title="Share Contact" onPress={handleShare} style={styles.actionButton} />
                    <TextButton title="Copy Address" onPress={handleCopy} />
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
        alignItems: 'center',
    },

    // Identity
    identitySection: {
        alignItems: 'center',
        marginTop: Layout.spacing.lg,
        marginBottom: 60, // Increased spacing to prevent OCR interference
    },
    name: {
        ...Typography.styles.title,
        fontSize: 24,
        marginTop: Layout.spacing.md,
        textAlign: 'center',
    },
    handle: {
        ...Typography.styles.body,
        color: Colors.textTertiary,
        marginTop: 4,
    },

    // QR
    qrSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Layout.spacing.xxl,
    },
    qrHelper: {
        ...Typography.styles.caption,
        color: Colors.textTertiary,
        marginTop: Layout.spacing.lg,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 10,
    },

    // Details 
    detailsSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Layout.spacing.xxl,
    },
    addressLabel: {
        ...Typography.styles.caption,
        color: Colors.textTertiary, // lighter
        fontWeight: '700',
        fontSize: 10,
        marginBottom: 4,
        letterSpacing: 1,
    },
    addressValue: {
        ...Typography.styles.body,
        color: Colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        maxWidth: '80%',
    },

    // Actions
    actionSection: {
        width: '100%',
        gap: Layout.spacing.md,
        marginTop: 'auto', // Push to bottom
    },
    actionButton: {
        width: '100%',
    }
});
