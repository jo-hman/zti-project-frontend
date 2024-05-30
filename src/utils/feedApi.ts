export const defaultHeaders = {'Content-Type': 'application/json'};

export const defaultHeadersWithAuthorization = (accessCode: string | null) => {
    return {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessCode};
}

const baseUrl = 'https://ztifinal-xz6xexabna-lm.a.run.app'

export const usersUrl = baseUrl + '/users';
export const authorizeUrl = baseUrl + '/users/authorize';

export const postsUrl = baseUrl + '/posts';

