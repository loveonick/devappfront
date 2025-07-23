import { Platform } from 'react-native';
import { createRecipe, deleteRecipe } from '../app/api/recipe_api';
import { addIngredient } from '../app/api/ingredient_api';
import { addProcedure } from '../app/api/procedure_api';

export const handleUpload = async (draft: any, steps: any[], user: any) => {
    console.log('handleUpload', { draft, steps, user });
    const formData = new FormData();
    const ingredientIds: string[] = [];
    const procedureIds: string[] = [];

    // Guardar pasos
    for (const step of steps) {
        const procedureFormData = new FormData();
        procedureFormData.append('content', step.description);
        if (step.imageFile) {
        if (Platform.OS === 'web') {
            procedureFormData.append('media', step.imageFile);
        } else {
            procedureFormData.append('media', step.imageFile, step.imageFile.name);
        }
        }
        const savedProcedure = await addProcedure(procedureFormData);
        procedureIds.push(savedProcedure._id);
    }
    formData.append('procedures', JSON.stringify(procedureIds));

    // Guardar ingredientes
    for (const ingredient of draft.ingredients ?? []) {
        const savedIngredient = await addIngredient(ingredient);
        ingredientIds.push(savedIngredient._id);
    }
    formData.append('ingredients', JSON.stringify(ingredientIds));

    formData.append('name', draft.title ?? '');
    formData.append('description', draft.description ?? '');
    formData.append('tags', JSON.stringify(draft.tags ?? []));
    formData.append('author', user._id);
    formData.append('type', draft.type ?? '');
    formData.append('isApproved', user.role === 'admin' ? 'true' : 'false');

    // Imagen principal
    if (Platform.OS === 'web' && draft.imageFile) {
        formData.append('media', draft.imageFile);
    } else if (draft.imageUri) {
        const filename = draft.imageUri.split('/').pop() ?? 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('media', {
        uri: draft.imageUri,
        name: filename,
        type,
        } as any);
    }

    const data = await createRecipe(formData);

    if (draft.duplicateId) {
        try {
        await deleteRecipe(draft.duplicateId);
        } catch (err) {
        console.warn('No se pudo eliminar receta duplicada:', err);
        }
    }

    return data.recipe;
};