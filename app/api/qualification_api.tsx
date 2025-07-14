//const url = 'https://dda1-backend.onrender.com/api';
const url = 'http://localhost:8080/api'

export const getQualificationsByRecipeId = async (recipeId) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
        method: "GET",
        headers: myHeaders,
        };
    
        const response = await fetch(`${url}/qualifications/recipe/${recipeId}`, requestOptions);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.qualifications || [];
    } catch (error) {
        console.error('Error fetching qualifications:', error);
        throw error;
    }
}
export const addQualification = async (recipeId, qualification: { userId: string, star: number, comment?: string }) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "content": qualification.comment,
            "author": qualification.userId,
            "stars": qualification.star,
            "recipeId": recipeId
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };
    
        const response = await fetch(`${url}/qualifications`, requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.qualification;
    } catch (error) {
        console.error('Error adding qualification:', error);
        throw error;
    }
}