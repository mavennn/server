require('dotenv').config();

class Env {
    getServerAddress() {
        const serverAddress = process.env.SERVER_ADDRESS;
        if (serverAddress === undefined) {
            throw new Error('Отсутствует конфигурация IP адреса')
        }
        return serverAddress.toString();
    };

    getServerPort() {
        const serverPort = process.env.SERVER_PORT;
        if (serverPort === undefined) { 
            throw new Error('Отсутствует конфигурация порта сервера');
        }
        return serverPort.toString();
    };

    getDatabaseUser() {
        const databaseUser = process.env.DATABASE_USER;
        if (databaseUser === undefined) {
            throw new Error('Отсутствует конфигурация пользователя базы данных');
        }
        return databaseUser.toString();
    };

    getDatabaseHost() {
        const databaseHost = process.env.DATABASE_HOST;
        if (databaseHost === undefined) {
            throw new Error('Отсутствует конфигурация хоста базы данных');
        }
        return databaseHost.toString();
    };

    getDatabaseName() {
        const databaseName = process.env.DATABASE_DATABASE;
        if (databaseName === undefined) {
            throw new Error('Отсутсвтует кофигурация названия базы данных');
        }
        return databaseName.toString();
    };

    getDatabasePassword() {
        const databasePassword = process.env.DATABASE_PASSWORD;
        if (databasePassword === undefined) {
            throw new Error('Отсутсвтует кофигурация пароля базы данных');
        }
        return databasePassword.toString();
    };

    getDatabasePort() {
        const databasePort = process.env.DATABASE_PORT;
        if (databasePort === undefined) {
            throw new Error('Отсутсвтует кофигурация порта базы данных');
        }
        return databasePort.toString();
    };

    getTableWithThings() {
        const table = process.env.TABLE_WITH_THINGS;
        if (table === undefined) {
            throw new Error ('Отсутствует конфигурация таблицы');
        }
        return table.toString();
    }
}

module.exports = { Env };