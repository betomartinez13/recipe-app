import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGroups } from '../../hooks/useGroups';
import { Colors } from '../../constants/colors';

interface GroupSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function GroupSelector({ selectedIds, onChange }: GroupSelectorProps) {
  const { data: groups, isLoading } = useGroups();

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((g) => g !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Grupos</Text>
        <Text style={styles.empty}>Cargando grupos...</Text>
      </View>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Grupos</Text>
        <Text style={styles.empty}>No tienes grupos aun</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Grupos (opcional)</Text>
      {groups.map((group) => {
        const selected = selectedIds.includes(group.id);
        return (
          <TouchableOpacity
            key={group.id}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => toggle(group.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
              {selected ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {group.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  empty: {
    fontSize: 13,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 6,
    backgroundColor: Colors.white,
    gap: 10,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF5F0',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 14,
    color: Colors.black,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
