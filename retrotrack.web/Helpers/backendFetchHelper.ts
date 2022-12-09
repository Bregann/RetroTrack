export const DoBackendGet = async (apiUrl: string, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.API_URL + apiUrl, {
            method: 'GET',
            headers: {'Authorization': sessionId}
        });
    }
    else{
        return await fetch(process.env.API_URL + apiUrl);
    }
}

export const DoBackendPost = async (apiUrl: string, data: any, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.API_URL + apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify(data)
        });
    }
    else{
        return await fetch(process.env.API_URL + apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
}

export const DoBackendDelete = async(apiUrl: string, data: any, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.API_URL + apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify(data)
        });
    }
    else{
        return await fetch(process.env.API_URL + apiUrl, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
}