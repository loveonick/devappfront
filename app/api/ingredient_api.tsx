const url = 'http://localhost:8080/api';

export const addIngredient = async (ingredient: { name: string; quantity: string; unit: string }) => {
    try {
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