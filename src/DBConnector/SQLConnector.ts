import { callbackify } from "util";
const bcrypt = require('bcrypt')
var mysql = require('mysql')

export var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: 'TWGdFEW5EqLhXiVC',
    database: process.env.DATABASE
})
export interface SQLErr {
    code: string,
    errno: string,
    sqlMessage: string
}

function getSql(query: string) {
    return new Promise((response) => {
        connection.query(
            query,
            function (err, rows) {
                if (err) {
                    response({ code: err.code, errno: err.errno, sqlMessage: err.sqlMessage });
                } else {
                    response(rows[0]);
                }
            }
        )
    }).then((response) => {
        return response;
    })
}
export async function CreateUser(nickname: string, email: string, password: string, typeUser: string) {
    return getSql('CALL CreateUser("' + nickname + '","' + email + '","' + await bcrypt.hash(password, 10) + '","' + typeUser + '");')
}
export function DeleteUser(idUser: string) {
    return getSql('CALL DeleteUser(' + idUser + ');')
}
export function GetUserById(idUser: string) {
    return getSql('CALL GetUserById(' + idUser + ');')
}

