import { Router } from "express";

import autoRouter from "./generic";
const saltRounds = 10;
interface IdAbility {
  idOwner: string;
}
class account {
  // business entity
  constructor(props) {
    Object.assign(this, props);
  }
}

function createRouter(capabilities: Array<string>, type: string, rest? :string) {   
    const router = Router()
    capabilities.forEach(cap => {
        autoRouter[cap](router, type, rest)
        
    })
    return router
}
module.exports = function (app) {
   
    app.use("/", createRouter(["CREATE", "SESSIONERROR", "GET", "UPDATE", "DELETE", "SUSPEND"], "customer"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "customer", "history"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant", "item"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant", "menu"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "restaurant", "stats"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "deliverer"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE", "PAY", "ACCEPT"], "order"))
};