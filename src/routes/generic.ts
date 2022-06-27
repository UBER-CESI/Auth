import { Router } from "express";
import session from "express-session";
import { Ability } from "@casl/ability";
import { AxiosReturn } from "../DBConnector/DBConnector";
import * as DB from "../DBConnector/DBConnector";
import * as Models from "../Models";
import * as AM from '../AbilitiesManager'

function handleAxiosReturns(dbRes, res) {
  if (!dbRes.status) {
    res.status(500).send("Internal Error");
    return;
  }
  res.status(dbRes.status).send(dbRes.data);
}
const autoRouter: {
    [key: string]: (router: Router, type: string, rest:string) => void;
} = {
    SESSIONERROR: (router, type, rest) => {
        router.use(`/${type}`, (req, res, next) => {
            if (!req.session || !req.session.email) {
                return res.status(401).send("User is not logged in")
                //req.session.rules = AM.GetRulesFor({typeUser : "admin"})
            }
            return next()
        })
    },
    GET: (router, type, rest) => {
        router.get([`/${type}`, `/${type}/:id`, `/${type}/:id/${rest}`, `/restaurant/${type}/:id/` ], async function (req, res) {
            var restUrl = (rest=== undefined)?"":rest
           
            const ab = new Ability(req.session.rules);
            if(req.query.byUid){
                console.log("kjjsbcvkebveksb")
                restUrl="?byUid=" + req.query.byUid  
                if(!ab.can('read', AM.subjects(type))){
                    res.status(401).send("User " + req.session.nickname + " cannot do that!")
                    return 
                }
            }else{
                console.log(type+restUrl)
                if (!ab.can('read', AM.subjects(type+restUrl)({restaurantId : req.params.id})) ) {
                    res.status(401).send("User " + req.session.nickname + " cannot do that!")
                    return
                }     
            }
           
           
            let dbRes: AxiosReturn = await DB.Get((req.params.id)?"/"+req.params.id:"", DB.typeEnum[type], (restUrl)?"/" + restUrl : "");
            handleAxiosReturns(dbRes, res)
        });
    },
    
    CREATE: (router, type, rest) => {
        router.put([`/${type}`, `/${type}/:id/:rest` ], async function (req, res) {
            var resteUrl = (req.params.rest || "")
            
            const ab = new Ability(req.session.rules);
            if (!ab.can('create', AM.subjects(type+resteUrl)( { restaurantId:req.session._id, customerId: req.session._id, ...req.body }))) {
                return res.status(401).send("User " + req.session.nickname + " cannot do that!")
            }
            req.body.customerId=req.session._id
            let dbRes: AxiosReturn = await DB.Create(req.body, DB.typeEnum[type], (resteUrl&& req.params.id)?"/" +req.params.id+"/"+resteUrl : "");
            handleAxiosReturns(dbRes, res);
        });
    },
    UPDATE: (router, type,rest) => {
        router.post([`/${type}/:id`,`/restaurant/${type}/:id/`, `/${type}/:id/${rest}`], async function (req, res) {
           
            const ab = new Ability(req.session.rules);
            const body = { id: req.params.id, ...req.body }
            console.log("body = " + JSON.stringify(body))
            const retDB = await DB.Get("/"+body.id, DB.typeEnum[type], "")
            if (retDB.error){
                console.log(retDB.error)
                res.status(404).send("no " + type + " with this id has been found")
                return
            }
            if (!ab.can('update', AM.subjects(type)( { ...body}))) {
                res.status(401).send("User " + req.session.nickname + " cannot do that!")
                return
            }
            
            let dbRes: AxiosReturn = await DB.Update(body, DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res)

        });
    },
    SUSPEND: (router, type,rest) => {
        router.post(`/${type}/:id/suspend`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            const body = { id: req.params.id, ...req.body }
            if (!ab.can('suspend', AM.subjects(type)(req.body))) {
                res.status(404).send("User " + req.session.nickname + " cannot do that!")
                return
            }

      let dbRes: AxiosReturn = await DB.Update(body, DB.typeEnum[type], "");
      handleAxiosReturns(dbRes, res);
    });
  },
    DELETE: (router, type,rest) => {
        router.delete(`/${type}/:id`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            const DBRes = await DB.Get("/"+req.params.id, DB.typeEnum[type], "")
            /*if (DBRes.error){
                res.status(404).send("no " + type + " found for this id")
                return 
            }*/
            if (!ab.can('delete', AM.subjects(type)({status:(<any>DBRes.data).status, customerId:req.session._id, userId: req.params.id, ...req.body }))) {
                res.status(404).send("User " + req.session.nickname + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Delete("/"+req.params.id, DB.typeEnum[type], "");
            handleAxiosReturns(dbRes, res)
           
        });
    },
    PAY: (router, type,rest) => {
        router.post(`/${type}/:id/pay`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            const getOrder: AxiosReturn = await DB.Get("/"+req.params.id, DB.typeEnum.order, "");
            if (getOrder.error){
                res.status(404).send("no order for this id")
                return 
            }
            if (!ab.can('pay', AM.subjects(type)(getOrder.data))) {
                res.status(401).send("User " + req.session.nickname + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Update({id:req.params.id, ...req.body}, DB.typeEnum.order, "/pay");
            handleAxiosReturns(dbRes, res)

        });
    },
    ACCEPT: (router, type,rest) => {
        router.post(`/${type}/:id/accept`, async function (req, res) {
            const ab = new Ability(req.session.rules);
            let getOrder: AxiosReturn = await DB.Get("/"+req.params.id, DB.typeEnum.order, "");
            if (getOrder.error){
                res.status(404).send("no order for this id")
                return 
            }
            if (!ab.can('accept', AM.subjects(type)(getOrder.data))) {
                res.status(401).send("User " + req.session.nickname + " cannot do that!")
                return
            }
            let dbRes: AxiosReturn = await DB.Update({id:req.params.id, ...req.body}, DB.typeEnum.order, "/accept");
            handleAxiosReturns(dbRes, res)

        });
    },
}

export default autoRouter
