//const url = 'http://localhost:8080/api';
const url = 'https://dda1-backend.onrender.com/api';

export const addIngredient = async (ingredient: { name: string; quantity: string; unit: string }) => {
    try {
        console.log('Adding ingredient:', ingredient);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "name": ingredient.name,
        "amount":ingredient.quantity,
        "unit": ingredient.unit
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
        };
        const response = await fetch(`${url}/ingredients`, requestOptions);
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el ingrediente');
        }
        const data = await response.json();
        return data.ingredient;
    } catch (error) {
        console.error('Error creating ingredient:', error);
        throw error;
    }
};

export const getIngredientById = async (id: string) => {
    try {
        const response = await fetch(`${url}/ingredients/${id}`);
        if (!response.ok) {
            throw new Error('Error fetching ingredient');
        }
        const data = await response.json();
        return data.ingredient;
    } catch (error) {
        console.error('Error fetching ingredient by ID:', error);
        throw error;
    }
};

export const updateIngredient = async (id: string, ingredientData: { name?: string; amount?: number; unit?: string }) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(ingredientData);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw
        };

        const response = await fetch(`${url}/ingredients/${id}`, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el ingrediente');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating ingredient:', error);
        throw error;
    }
};
