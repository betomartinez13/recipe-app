import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Recipe } from '../../types/recipe.types';
import { Colors } from '../../constants/colors';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
  onPress: () => void;
}

export function RecipeCard({ recipe, showAuthor = false, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        {recipe.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {recipe.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          {showAuthor && recipe.user ? (
            <Text style={styles.author}>por {recipe.user.name}</Text>
          ) : null}
          <Text style={styles.meta}>
            {recipe.ingredients.length} ingredientes · {recipe.steps.length} pasos
          </Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  description: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  author: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    color: Colors.gray,
  },
  arrow: {
    fontSize: 24,
    color: Colors.lightGray,
    marginLeft: 8,
  },
});
