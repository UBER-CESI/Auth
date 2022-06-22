import { Router } from "express"
import session from "express-session"
import { Ability } from "@casl/ability";
import { AxiosReturn } from "../DBConnector/DBConnector";
import * as DB from "../DBConnector/DBConnector"
import * as Models from "../Models";
import { abilities } from '../AbilitiesManager'

function handleAxiosReturns(dbRes, res) {
    if (!dbRes.status) {
        res.status(500).send("Internal Error")
        return
    }
    res.status(dbRes.status).send(dbRes.data)
}
const autoRouter: {
    [key: string]: (router: Router, type: string) => void;
} = {
    SESSIONERROR: (router, type) => {
        router.use(`/${type}`, (req, res, next) => {
            if (!req.session || !req.session.email) {
                return res.status(401).send("User is not logged in")
            }
            return next()
        })
    },
    GET: (router, type) => {
        router.get([`/${type}`, `/${type}/:id`], async function (req, res) {
            const ab = new Ability(req.session.rules);
            if (!ab.can('read', type)) {
                res.status(401).send("User " + req.session.username + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Get(req.params.id || "", DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res)
        });
    },
    CREATE: (router, type) => {
        router.put(`/${type}`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            if (!ab.can('create', type)) {
                return res.status(401).send("User " + req.session.username + " cannot do that!")
            }
            let dbRes: AxiosReturn = await DB.Create(req.body, DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res);
        });
    },
    UPDATE: (router, type) => {
        router.post(`/${type}/:id`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            const body = { id: req.params.id, ...req.body }
            if (!ab.can('update', type)) {
                res.status(401).send("User " + req.session.username + " cannot do that!")
                return
            }

            let dbRes: AxiosReturn = await DB.Update(body, DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res)

        });
    },
    DELETE: (router, type) => {
        router.delete(`/${type}/:id`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            if (!ab.can('delete', type)) {
                res.status(401).send("User " + req.session.username + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Delete(req.params.id, DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res)
        });
    },
    PAY: (router, type) => {
        router.post(`/${type}/:id/pay`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            if (!ab.can('pay', type)) {
                res.status(401).send("User " + req.session.username + " cannot do that!")
                return
            }

            let dbRes: AxiosReturn = await DB.Update(req.params.id, DB.typeEnum.order, "/pay");
            handleAxiosReturns(dbRes, res)

        });
    },
    ACCEPT: (router, type) => {
        router.post(`/${type}/:id/accept`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            if (!ab.can('accept', type)) {
                res.status(401).send("User " + req.session.username + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Update(req.params.id, DB.typeEnum.order, "/pay");
            handleAxiosReturns(dbRes, res)

        });
    },
}

export default autoRouter