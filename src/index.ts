import { Server } from "http";
import * as Models from "./Models";
import * as AM from './AbilitiesManager'
import { Ability, ExtractSubjectType, MongoQuery, Subject, SubjectRawRule } from "@casl/ability";
import express from "express"
import session from "express-session"
import bodyParser from "body-parser";
import bcrypt from "bcrypt"
const app = express();
import * as SQL from "./DBConnector/SQLConnector"
import * as DB from "./DBConnector/DBConnector"
import { user } from "./PlaceHolders";
import { Axios } from "axios";
import { json } from "body-parser";
import { AnyObject } from "@casl/ability/dist/types/types";
import { ReadableStreamBYOBReader } from "stream/web";

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});

app.use(session({
    secret: 'X5ix1MylhUTBWRU',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000000 }, // in miliseconds
}));
declare module "express-session" {
    interface SessionData {
        username: string,
        nickname: string,
        email: string
        userId: string;
        type: Models.UserType;
        _id:string
        rules: SubjectRawRule<string, ExtractSubjectType<Subject>, MongoQuery<AnyObject>>[]
    }
}
const LinkUser: { [K: string]: Function } = {
    customer: linkUserToCustomer,
    restaurant: linkUserToRestaurant,
    deliverer: linkUserToDeliverer,
    admin: () => { },
}

async function linkUserToCustomer(_userId: string, data): Promise<DB.AxiosReturn> {
    
    if (data.typeId) {
     
        return await DB.Update({ userId: _userId, id: data.typeId }, DB.typeEnum.customer, "")
    } else {
       
        data.userId = _userId.toString();
        console.log (data)
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

app.use(`/`, (req, res, next) => {
    if (!req.session.rules) {
        req.session.rules = AM.abilities["guest"]();
    }
    next()
})

require('./routes')(app);


//createUser
app.put('/user', async function (req, res) {
    const ab = new Ability(req.session.rules)   
    if (!ab.can('create',AM.subjects["account"] (req.body))){
        res.status(404).send("User cannot do that")
        return 
    }
    
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
    var skip2 = false
    var retDB
    await Promise.all(alltypes.map(async (type) => {
        console.log("type == " + type)
        if (type != "admin") {
            var retDB: DB.AxiosReturn = await LinkUser[type](sqlRes.data.userId, data);
            console.log("DB === " + retDB.data)        
           
            if (retDB.error) {
                skip2 = true;
                return
            }else{
                finalObject = Object.assign(finalObject, retDB.data);
            }
        }
    }));
    if (skip2) {
        res.status(404).send()
        return
    }

    res.json(finalObject)

});
app.post('/login', async (req, res) => {
    const user: SQL.SQLRes = await SQL.GetUserByEmail(req.body.email);
    if (!user.data) {
        res.status(404).send("Wrong id");
        return
    }
    if (user.errno) {
        res.status(404).json(user)
        return
    }
    console.log(user)
    if (!await bcrypt.compare(req.body.password, user.data.pwd)) {
        res.status(404).send("Wrong ida");
        return
    }
  

    if (user.data.typeUser != "admin") {
        const mongoUser = await DB.Get("", <DB.typeEnum>user.data.typeUser, "?byUid=" + user.data.userId)
        console.log("mongouser === ")
        console.log(mongoUser.data)
        if (!mongoUser) {
            res.status(404).send("user not find in bdd");
            return
        }
        InstanciateSession({...user.data, ...mongoUser.data}, req.session)
        res.json({ email: user.data.email, nickname: user.data.nickname, typeUser: user.data.typeUser, userId: user.data.userId, ...mongoUser.data });
        return
    }
    InstanciateSession(user.data, req.session)
    res.json({ email: user.data.email, nickname: user.data.nickname, typeUser: user.data.typeUser, userId: user.data.userId });



});



app.get('/login/canDoHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.nickname) {
        const ability = new Ability(sess.rules);
        res.send(ability.can('do', 'hoola-hoop'));
    } else {
        res.send("notConnected");
    }
})
app.get('/login/canDoBetterHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.nickname) {
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






function InstanciateSession(user, sess) {

    sess.nickname = user.nickname;
    sess.email = user.email;
    sess.userId = user.userId;
    sess.type = user.typeUser;
    sess.idType = user._id
    sess.rules = AM.GetRulesFor(user);
    console.log("id = " + sess._id)
    //return getUserFromSession(sess);


}

export default {
    async spawn() { },
    stop() {
        server.close();

    },
};

