import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import { Colors } from '@/shared/theme/Colors';
import { Layout } from '@/shared/theme/Layout';
import { Typography } from '@/shared/theme/Typography';
import { Avatar } from './Avatar';
import * as Haptics from 'expo-haptics';

interface ContactCardProps extends TouchableOpacityProps {
    name: string;
    detail: string;
    addedVia?: 'manual' | 'qr';
    onPress: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
    name,
    detail,
    addedVia,
    onPress,
    ...props
}) => {
    const handlePress = () => {
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.6} // More subtle press
            {...props}
        >
            <Avatar name={name} size={50} />
            <View style={styles.textContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    {addedVia === 'qr' ? (
                        <View style={styles.qrBadge}>
                            <Text style={styles.qrBadgeText}>QR</Text>
                        </View>
                    ) : null}
                </View>
                {/* Only show detail if it exists, caption style */}
                {detail ? (
                    <Text style={styles.detail} numberOfLines={1}>
                        {detail}
                    </Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Layout.spacing.lg, // Increased padding (Airy)
        paddingHorizontal: Layout.spacing.md, // Add horizontal padding for touch target
        backgroundColor: Colors.background,
        // Minimalist separator Logic: handled by FlatList ItemSeparatorComponent usually, 
        // but here we can keep a very subtle border or remove it for a cleaner look.
        // Let's keep a very faint border for list readability.
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    textContainer: {
        marginLeft: Layout.spacing.lg, // More space between avatar and text
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Layout.spacing.xs,
    },
    name: {
        ...Typography.styles.body,
        fontWeight: '700', // Stronger weight
        fontSize: 17, // Slightly larger
        color: Colors.text,
        marginBottom: 2,
        maxWidth: '88%',
    },
    qrBadge: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.radius.round,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: Colors.secondary,
    },
    qrBadgeText: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        fontSize: 10,
        letterSpacing: 0.6,
    },
    detail: {
        ...Typography.styles.caption,
        color: Colors.textTertiary, // lighter gray for hierarchy
        fontSize: 13,
    },
});
