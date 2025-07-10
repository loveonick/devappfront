//const url = 'http://localhost:8080/api';
const url = 'https://dda1-backend.onrender.com/api';

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
};
export const registerApi = async (name, email, password) => {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            "name": name,
            "email": email,
            "password": password,
            "favorites": [],
            "role": "user"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        const res = await fetch(`${url}/users`, requestOptions);
        if (!res.ok) throw new Error('Error al registrar usuario');

        const data = await res.json();
        return data.user
    } catch(error){
        console.log(error)
        throw error
    }
};