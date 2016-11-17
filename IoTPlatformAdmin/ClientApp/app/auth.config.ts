interface AuthConfiguration {
    clientID: string,
    domain: string,
    callbackURL: string
}

export const myConfig: AuthConfiguration = {
    clientID: 'v3rhkWFDzsIYEIDsmYQMUh5wI0TdOMrz',
    domain: 'iotplatformadmin.eu.auth0.com',
    callbackURL: 'http://localhost:10076/'
};
