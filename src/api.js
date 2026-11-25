/** Reads { error } from an API response, falling back to a generic message. */
export async function errorMessage(response, fallback) {
    try {
        const body = await response.json();
        return body.error || fallback;
    } catch {
        return fallback;
    }
}

/**
 * fetch() for our JSON API: sends `body` as JSON, returns the parsed response,
 * and throws an Error with the server's message if the request failed.
 */
export async function apiJson(url, { method = 'GET', body } = {}) {
    const response = await fetch(url, {
        method,
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(await errorMessage(response, 'Something went wrong, please try again'));
    }
    return response.json();
}
