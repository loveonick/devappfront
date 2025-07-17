//const url = 'http://localhost:8080/api';
const url = 'https://dda1-backend.onrender.com/api';

export const addProcedure = async (formData: FormData) =>{
    const requestOptions = {
    method: "POST",
    body: formData
    };
    const response = await fetch(`${url}/procedures`, requestOptions);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el procedimiento');
    }
    const data = await response.json();
    return data.procediment;
}