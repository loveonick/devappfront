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

        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Error al iniciar sesión');
            throw error;
        }
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
        

        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Error al registrar usuario');
            (error as any).suggestions = data.suggestions;
            throw error;
        }
        return data.user
    } catch(error){
        console.log(error)
        throw error
    }
};

export const sendRecoveryCodeApi = async (email) => {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ email }),
        };

        const res = await fetch(`${url}/login/send-recovery-code`, requestOptions);

        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Error al enviar el código de recuperación');
            throw error;
        }
        return data.message;
    } catch(error){
        console.log(error)
        throw error
    }
};

export const verifyRecoveryCodeApi = async (email, code) => {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ email, code }),
        };

        const res = await fetch(`${url}/login/verify-code`, requestOptions);

        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Error al verificar el código de recuperación');
            throw error;
        }
        return data.message;
    } catch(error){
        console.log(error)
        throw error
    }
};

export const resetPasswordApi = async (email, newPassword) => {
    try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ email, newPassword }),
        };

        const res = await fetch(`${url}/login/reset-password`, requestOptions);

        const data = await res.json();
        if (!res.ok) {
            const error = new Error(data.message || 'Error al restablecer la contraseña');
            throw error;
        }
        return data.message;
    } catch(error){
        console.log(error)
        throw error
    }
};