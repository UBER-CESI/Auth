import { Router } from "express";

import autoRouter from "./generic";
import notifications from "./notifications";
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

function createRouter(capabilities: Array<string>, type: string, rest?: string) {
  const router = Router()
  capabilities.forEach(cap => {
    autoRouter[cap](router, type, rest)

  })
  return router
}
module.exports = function (app) {
    app.use("/notifications", notifications)
    app.use("/", createRouter(["CREATE", "SESSIONERROR", "GET", "UPDATE", "DELETE"], "customer"))
    app.use("/", createRouter(["SUSPEND"], "customer","suspend"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "customer", "history"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant", "menu"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "menu"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "restaurant", "stats"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "restaurant", "history"))    
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "deliverer"))
    app.use("/", createRouter(["SESSIONERROR","GET"], "deliverer", "history"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE", "PAY", "ACCEPT"], "order"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "item"))
};
