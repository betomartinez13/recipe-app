import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../hooks/useGroups';
import { GroupCard } from '../../components/groups/GroupCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../constants/colors';

export default function GroupsScreen() {
  const router = useRouter();
  const { data: groups, isLoading, isError, refetch } = useGroups();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar grupos</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!groups || groups.length === 0 ? (
        <EmptyState
          message="No tienes grupos aun"
          submessage="Crea uno para organizar tus recetas!"
          actionLabel="Crear grupo"
          onAction={() => router.push('/group/create')}
        />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => router.push(`/group/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/group/create')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 80,
  },
  errorText: {
    color: Colors.gray,
    fontSize: 16,
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
