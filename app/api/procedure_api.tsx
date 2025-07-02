const url = 'http://localhost:8080/api';

export const addProcedure = async (step: { description: string; imageUri?: string }) =>{
    const formData = new FormData();
      if (step.imageUri) {
        formData.append('media', {
        uri: step.imageUri,
        type: 'image/jpeg', // ajustar si necesario
        name: 'step.jpg',
        } as any);
    }

    const requestOptions = {
    method: "POST",
    body: formData
    };
    formData.append('content', step.description);

    const response = await fetch(`${url}/procedures`, requestOptions);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el procedimiento');
    }
    const data = await response.json();
    return data.procediment;
}