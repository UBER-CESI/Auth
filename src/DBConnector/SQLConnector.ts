import { callbackify } from "util";
const bcrypt = require('bcrypt')
var mysql = require('mysql')

export var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: 'TWGdFEW5EqLhXiVC',
    database: process.env.DATABASE
})

export interface SQLRes {
    code?: number,
    errno?: number,
    sqlMessage?: string,
    data?: DataSql
}
export interface DataSql {
    userId: string,
    nickname: string,
    email: string,
    typeUser: string
}

function getSql(query: string): Promise<SQLRes> {
    return new Promise<SQLRes>((response) => {
        connection.query(
            query,
            function (err, rows) {
                if (err) {
                    response({ code: err.code, errno: err.errno, sqlMessage: err.sqlMessage });
                } else {
                    response({ data: rows[0] });
                }
            }
        )
    }).then((response) => {
        return response;
    })
}
export async function CreateUser(nickname: string, email: string, password: string, typeUser: string): Promise<SQLRes> {
    var a: SQLRes = await getSql('CALL CreateUser("' + nickname + '","' + email + '","' + await bcrypt.hash(password, 10) + '","' + typeUser + '");')
    var : SQLRes = await getSql('CALL CreateUser("' + nickname + '","' + email + '","' + await bcrypt.hash(password, 10) + '","' + typeUser + '");')
    console.log("testilugbzqfljkyu : " + JSON.stringify(a))
    return a
}
export function DeleteUser(idUser: string): Promise<SQLRes> {
    return getSql('CALL DeleteUser(' + idUser + ');')
}
export function GetUserById(idUser: string): Promise<SQLRes> {
    return getSql('CALL GetUserById(' + idUser + ');')
}

