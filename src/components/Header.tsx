import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface HeaderProps {
	title?: string;
	showLogo?: boolean;
	customIcon?: ReactNode;
	iconSize?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
	title = 'UniSportsCard', 
	showLogo = true,
	customIcon,
	iconSize = 32
}) => {
	return (
		<View style={styles.header}>
			<View style={styles.logoContainer}>
				{showLogo && (
					customIcon ? (
						<View style={[styles.customIconContainer, { width: iconSize, height: iconSize }]}>
							{customIcon}
						</View>
					) : (
						<View style={[styles.logo, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]} />
					)
				)}
				<Text style={styles.appName}>{title}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	// 헤더
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 15.5,
		borderBottomWidth: 1.5,
		borderBottomColor: '#E2E8EE',
		marginBottom: 0,
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logo: {
		backgroundColor: COLORS.GRAY_300,
		marginRight: 12,
	},
	customIconContainer: {
		marginRight: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	appName: {
		fontSize: 21,
		fontWeight: '700',
		color: COLORS.PRIMARY,
	},
});

export default Header;
