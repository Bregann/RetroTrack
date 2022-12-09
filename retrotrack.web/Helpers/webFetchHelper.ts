export const DoGet = async (apiPath: string, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
            method: 'GET',
            headers: {'Authorization': sessionId}
        });
    }
    else{
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath);
    }
}

export const DoPost = async (apiPath: string, data: any, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify(data)
        });
    }
    else{
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
}

export const DoDelete = async(apiPath: string, data: any, sessionId?: string) => {
    if(sessionId){
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify(data)
        });
    }
    else{
        return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
}