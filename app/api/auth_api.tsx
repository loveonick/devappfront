const url = 'http://dda1-backend-git-master-fedegonzalo16s-projects.vercel.app/api';

export const loginApi = async (email,password) => {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ email, password }),
        };

        const res = await fetch(`${url}/login`, requestOptions);
        if (!res.ok) throw new Error('Error al iniciar sesión');

        const data = await res.json();
        return data.user
    } catch(error){
        console.log(error)
        throw error
    }
}