import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useRecipe, useDeleteRecipe, useAddToGroups } from '../../hooks/useRecipes';
import { useGroups } from '../../hooks/useGroups';
import { useAuthStore } from '../../store/auth.store';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Colors } from '../../constants/colors';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();
  const { mutate: addToGroups, isPending: isAddingGroup } = useAddToGroups();
  const { data: allGroups } = useGroups();
  const currentUser = useAuthStore((s) => s.user);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  const isOwner = currentUser != null && recipe?.userId === currentUser.id;

  const currentGroupIds = recipe?.groups?.map((g) => g.group.id) ?? [];
  const availableGroups = (allGroups ?? []).filter((g) => !currentGroupIds.includes(g.id));

  const handleAddToGroup = (groupId: string, groupName: string) => {
    addToGroups(
      { recipeId: id, groupIds: [groupId] },
      {
        onSuccess: () => setShowGroupPicker(false),
        onError: () => Alert.alert('Error', `No se pudo agregar al grupo "${groupName}".`),
      },
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar receta',
      `¿Seguro que quieres eliminar "${recipe?.title}"? Esta accion no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(id, {
              onSuccess: () => router.back(),
              onError: () =>
                Alert.alert('Error', 'No se pudo eliminar la receta. Intenta de nuevo.'),
            });
          },
        },
      ],
    );
  };

  if (isLoading) return <LoadingScreen />;

  if (isError || !recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Receta no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: recipe.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>‹ Volver</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {/* Header */}
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.user && (
        <Text style={styles.author}>Creada por {recipe.user.name}</Text>
      )}
      {recipe.description ? (
        <Text style={styles.description}>{recipe.description}</Text>
      ) : null}

      {/* Groups */}
      <View style={styles.section}>
        <View style={styles.groupsRow}>
          {recipe.groups && recipe.groups.length > 0 ? (
            <View style={styles.chips}>
              {recipe.groups.map((g) => (
                <View key={g.group.id} style={styles.chip}>
                  <Text style={styles.chipText}>{g.group.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noGroups}>Sin grupos</Text>
          )}
          {isOwner && (
            <TouchableOpacity
              style={styles.addGroupBtn}
              onPress={() => setShowGroupPicker((v) => !v)}
            >
              <Text style={styles.addGroupBtnText}>+ Agregar a grupo</Text>
            </TouchableOpacity>
          )}
        </View>

        {showGroupPicker && (
          <View style={styles.groupPicker}>
            {availableGroups.length === 0 ? (
              <View style={styles.groupPickerItem}>
                <Text style={styles.groupPickerEmptyText}>
                  {(allGroups ?? []).length === 0
                    ? 'No tienes grupos. Crea uno desde la pestaña Grupos.'
                    : 'Esta receta ya esta en todos tus grupos.'}
                </Text>
              </View>
            ) : (
              availableGroups.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={styles.groupPickerItem}
                  onPress={() => handleAddToGroup(g.id, g.name)}
                  disabled={isAddingGroup}
                >
                  <Text style={styles.groupPickerItemText}>{g.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥕 Ingredientes</Text>
        {recipe.ingredients.map((ing, i) => (
          <View key={ing.id ?? i} style={styles.ingredientRow}>
            <Text style={styles.ingredientBullet}>•</Text>
            <Text style={styles.ingredientText}>
              <Text style={styles.bold}>{ing.name}</Text>
              {' — '}
              {ing.quantity}
              {ing.unit ? ` ${ing.unit}` : ''}
            </Text>
          </View>
        ))}
      </View>

      {/* Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Preparacion</Text>
        {recipe.steps.map((step, i) => (
          <View key={step.id ?? i} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step.description}</Text>
          </View>
        ))}
      </View>

      {/* Owner actions */}
      {isOwner ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/recipe/edit/${id}`)}
          >
            <Text style={styles.editBtnText}>Editar receta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteBtnText}>
              {isDeleting ? 'Eliminando...' : 'Eliminar receta'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.black,
    lineHeight: 22,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 12,
  },
  groupsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  noGroups: {
    fontSize: 13,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  addGroupBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  addGroupBtnText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  groupPicker: {
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  groupPickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  groupPickerItemText: {
    fontSize: 14,
    color: Colors.black,
  },
  groupPickerEmptyText: {
    fontSize: 13,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  ingredientBullet: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 1,
  },
  ingredientText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
    paddingTop: 4,
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  editBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    color: Colors.gray,
    marginBottom: 16,
  },
  backBtn: {
    paddingRight: 16,
  },
  backBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
