//const url = 'http://localhost:8080/api';
const url = 'https://dda1-backend.onrender.com/api';

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

export const getPendingQualifications = async () => {
  try {
    const response = await fetch(`${url}/qualifications/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const qualifications = data.qualifications.map((q) => ({
      id: q._id,
      content: q.content,
      stars: q.stars,
      author: q.author?.name ?? "Desconocido",
      recipeId: q.recipeId,
      date: q.createdAt,
    }));
    return qualifications;
  } catch (error) {
    console.error("Error fetching pending qualifications:", error);
    throw error;
  }
};

export const getApprovedQualifications = async () => {
  try {
    const response = await fetch(`${url}/qualifications/approved`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const qualifications = data.qualifications.map((q) => ({
      id: q._id,
      content: q.content,
      stars: q.stars,
      author: q.author?.name ?? "Desconocido",
      recipeId: q.recipeId,
      date: q.createdAt,
    }));
    return qualifications;
  } catch (error) {
    console.error("Error fetching approved qualifications:", error);
    throw error;
  }
};

export const approveQualification = async (qualificationId) => {
  try {
    const response = await fetch(`${url}/qualifications/${qualificationId}/approve`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving qualification:", error);
    throw error;
  }
};



