export const DoBackendGet = async (apiUrl: string) => {
    return await fetch(process.env.API_URL + apiUrl, { cache: 'no-store' });
}

export const DoBackendPost = async (apiUrl: string, data: any) => {
    const res = await fetch(process.env.API_URL + apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return res.json();
}

export const DoBackendDelete = async(apiUrl: string, data: any) => {

    return await fetch(process.env.API_URL + apiUrl, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}