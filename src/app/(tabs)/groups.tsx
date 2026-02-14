import { View, FlatList, TouchableOpacity, Text, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../hooks/useGroups';
import { GroupCard } from '../../components/groups/GroupCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorScreen } from '../../components/common/ErrorScreen';
import { Colors } from '../../constants/colors';

export default function GroupsScreen() {
  const router = useRouter();
  const { data: groups, isLoading, isError, isRefetching, refetch } = useGroups();

  if (isLoading) return <LoadingScreen color={Colors.secondary} />;
  if (isError) return <ErrorScreen message="Error al cargar grupos" onRetry={refetch} />;

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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.secondary}
              colors={[Colors.secondary]}
            />
          }
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
  list: {
    paddingVertical: 12,
    paddingBottom: 80,
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
