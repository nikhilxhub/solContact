import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { Typography } from '../constants/Typography';
import { Avatar } from './Avatar';
import * as Haptics from 'expo-haptics';

interface ContactCardProps extends TouchableOpacityProps {
    name: string;
    detail: string;
    onPress: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
    name,
    detail,
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
            activeOpacity={0.7}
            {...props}
        >
            <Avatar name={name} size={40} />
            <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.detail} numberOfLines={1}>
                    {detail}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Layout.spacing.md,
        backgroundColor: Colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    textContainer: {
        marginLeft: Layout.spacing.md,
        flex: 1,
    },
    name: {
        ...Typography.styles.body,
        fontWeight: '600',
        color: Colors.text,
    },
    detail: {
        ...Typography.styles.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
