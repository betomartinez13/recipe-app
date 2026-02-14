import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface GroupCardProps {
  group: { id: string; name: string; description?: string; recipeCount?: number };
  onPress: () => void;
}

export function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.name}>{group.name}</Text>
        {group.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {group.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{group.recipeCount ?? 0}</Text>
        </View>
        <Text style={styles.badgeLabel}>recetas</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  description: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },
  right: {
    alignItems: 'center',
    marginLeft: 12,
    gap: 2,
  },
  badge: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  badgeLabel: {
    fontSize: 10,
    color: Colors.gray,
  },
  arrow: {
    fontSize: 20,
    color: Colors.lightGray,
    marginTop: 2,
  },
});
