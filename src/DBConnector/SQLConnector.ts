import { json } from "body-parser";
import { Console } from "console";
import { callbackify } from "util";
const bcrypt = require('bcrypt')
var mssql = require('mssql')

/*
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERV,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}*/
const sqlConfig = {
    user: "sa",
    password: "z9TIiqfONLXOELxVrB+fs",
    database: "authbdd",
    server: "sleepycat.date",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}
export interface SQLRes {
    code?: number,
    errno?: number,
    sqlMessage?: string,
    data: DataUserSql
}
export interface DataUserSql {
    userId: string,
    nickname: string,
    email: string,
    typeUser: string,
    pwd: string
}

function getSql(query: string): Promise<any> {

    return new Promise<any>(async (response) => {
        await mssql.connect(sqlConfig)
        mssql.query(query, (err, rows) => {
            if (err) {
                response(err);
            } else {

                try {

                    response({ data: JSON.parse(JSON.stringify(rows["recordset"][0])) });

                } catch (e) {
                    response(rows);
                }
            }

        })
    })
}
export async function CreateUser(nickname: string, email: string, password: string, typeUser: string): Promise<SQLRes> {
    var passwordHashed = await bcrypt.hash(password, 10)
    var a = await getSql("DECLARE @return_value int EXEC @return_value = [dbo].[CreateUser] @nickname = N'" + nickname + "', @email = N'" + email + "', @pwd = N'" + passwordHashed + "', @typeUser = N'" + typeUser + "' SELECT	'Return Value' = @return_value ")
    a.data.pwd = " ";
    return a
}
export function DeleteUser(idUser: string): Promise<SQLRes> {
    return getSql('CALL DeleteUser(' + idUser + ');')
}
export function GetUserById(idUser: string): Promise<SQLRes> {
    return getSql('CALL GetUserById(' + idUser + ');')
}
export function GetUserBy(idUser: string): Promise<SQLRes> {
    return getSql('CALL GetUserById(' + idUser + ');')
}
export function GetUserByEmail(email: string): Promise<SQLRes> {
    return getSql("DECLARE	@return_value int EXEC	@return_value = [dbo].[GetUserByEmail] @email = N'" + email + "'SELECT	'Return Value' = @return_value")
}




