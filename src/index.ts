import { Server } from "http";
import * as Models from "./Models";
import * as Abilities from './AbilitiesManager'
import { Ability } from "@casl/ability";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();
import * as SQL from "./DBConnector/SQLConnector"
import * as DB from "./DBConnector/DBConnector"
import { user } from "./PlaceHolders";
import { Axios } from "axios";
import { json } from "body-parser";



const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});





app.use(session({
    secret: 'X5ix1MylhUTBWRU',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000000 }, // in miliseconds
}));

const LinkUser: { [K: string]: Function } = {
    customer: linkUserToCustomer,
    restaurant: linkUserToRestaurant,
    deliverer: linkUserToDeliverer,
    admin: linkUserToAdmin,
}
async function linkUserToAdmin(_userId?: string, data?): Promise<DB.AxiosReturn> {
    console.log("admin")
    return {}

}
async function linkUserToCustomer(_userId: string, data): Promise<DB.AxiosReturn> {

    console.log("datalkqzhbbf === " + data)
    if (data.typeId) {
        return await DB.Update({ userId: _userId, id: data.typeId }, DB.typeEnum.customer, "")
    } else {
        data.userId = _userId;
        console.log("data : " + _userId)
        return await DB.Create(data, DB.typeEnum.customer, "");


    }

}
async function linkUserToRestaurant(_userId?: string, data?): Promise<DB.AxiosReturn> {
    if (data.TypeId) {
        return await DB.Update({ userId: _userId, id: data.typeId }, DB.typeEnum.restaurant, "")
    } else {
        data.userId = _userId;
        return await DB.Create(data, DB.typeEnum.restaurant, "")
    }
}
async function linkUserToDeliverer(_userId?: string, data?): Promise<DB.AxiosReturn> {
    if (data.TypeId) {
        return await DB.Update({ userId: _userId, id: data.typeId }, DB.typeEnum.deliverer, "")
    } else {
        data.userId = _userId;
        return await DB.Create(data, DB.typeEnum.deliverer, "")
    }

}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

require('./routes')(app);


//createUser
app.put('/user', async function (req, res) {
    let data = req.body;
    let alltypes = data.typeUser.split(",")
    let skip = false;
    alltypes.forEach(type => {
        if (!Object.values(Models.UserType).includes(type.toLowerCase())) {
            res.status(404).send("This type of account does not exists : " + type)
            skip = true;
            return;
        }
    });
    if (skip) { return };
    const sqlRes: SQL.SQLRes = await SQL.CreateUser(data.nickname, data.email, data.password, data.typeUser);
    if (sqlRes.errno) { res.json(sqlRes); return; }
    var finalObject = sqlRes.data
    await Promise.all(alltypes.map(async (type) => {
        var retDB: DB.AxiosReturn = await (LinkUser[type](sqlRes.data.userId, data));
        finalObject = Object.assign({}, finalObject, retDB.data)
        if (retDB.error) {
            return
        }
    }));
    res.json(finalObject);
});
app.post('/login', async (req, res) => {
    const user: SQL.SQLRes = await SQL.GetUserByEmail(req.body.email);
    if (!user) {
        res.status(404).send("Wrong ida");
        return
    }
    if (user.errno) {
        res.status(404).json(user)
        return
    }
    console.log(user.data.pwd)
    if (!await bcrypt.compare(req.body.password, user.data.pwd)) {
        res.status(404).send("Wrong idg");
        return
    }
    //const userFromMongo;
    res.json("loged-in");
});







/*



    if (FinalUser.email === req.body.email && FinalUser.password === req.body.password) {
        res.json(InstanciateSession(FinalUser, req.session));
        console.log(Date.now().toString() + " | " + FinalUser.id);

    } else {
        if (DelivererUser.email === req.body.email && DelivererUser.password === req.body.password) {
            var ret: Models.UserWoPasswd = InstanciateSession(DelivererUser, req.session)
            res.json(ret);


        } else {
            if (AdminUser.email === req.body.email && AdminUser.password === req.body.password) {
                var ret: Models.UserWoPasswd = InstanciateSession(AdminUser, req.session)
                res.json(ret);

            } else {
                res.status(404).send('wrong id');

            }

        }
    }

});


*/

app.get('/login/canDoHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        const ability = new Ability(sess.rules);
        res.send(ability.can('do', 'hoola-hoop'));
    } else {
        res.send("notConnected");
    }
})
app.get('/login/canDoBetterHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        const ability = new Ability(sess.rules);
        res.send(ability.can('do', 'better hoola-hoop'));
    } else {
        res.send("notConnected");
    }
})
app.get('/login/getMySessionUsername', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        res.send(sess.nickname);
    } else {
        res.send("notConnected");
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.status(200).json()
    });
});






function InstanciateSession(user: SQL.DataUserSql, sess) {

    sess.nickname = user.nickname;
    sess.email = user.email;
    sess.userId = user.userId;
    sess.type = user.typeUser;
    sess.rules = Abilities.GetRulesFor(user);
    //return getUserFromSession(sess);


}

export default {
    async spawn() { },
    stop() {
        server.close();

    },
};

