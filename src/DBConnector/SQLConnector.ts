import { callbackify } from "util";
import { bcrypt } from 'bcrypt'
var mysql = require('mysql')

export var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: 'TWGdFEW5EqLhXiVC',
    database: process.env.DATABASE
})

function getSql(query: string) {
    return new Promise((response) => {
        connection.query(
            query,
            function (err, rows) {
                if (err) {
                    response(err);
                } else {
                    response(rows);
                }
            }
        )
    }).then((response) => {
        return response;
    })
}
export async function CreateUser(nickname: string, email: string, password: string) {
    return getSql('CALL CreateUser("' + nickname + '","' + email + '","' + await bcrypt.hash(password, 10) + '");')
}
export function DeleteUser(idUser: string) {
    return getSql('CALL DeleteUser(' + idUser + ');')
}
export function GetUserById(idUser: string) {
    return getSql('CALL GetUserById(' + idUser + ');')
}

