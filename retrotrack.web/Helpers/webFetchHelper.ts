export const DoGet = async (apiPath: string) => {
    return await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, { cache: 'no-store' });
}

export const DoPost = async (apiPath: string, data: any) => {
    const res = await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return res.json();
}

export const DoDelete = async(apiPath: string, data: any) => {

    const res = await fetch(process.env.NEXT_PUBLIC_WEB_URL + apiPath, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    return res;
}