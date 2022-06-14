import axios from "axios";
import { json } from "body-parser";
import * as Models from "../Models";
import *  as ph from "../PlaceHolders"
const adresses: Array<string> = new Array<string>
    (
        "1",
        "2",
        "3"
    );

var adressInUse;
function getLoadBalancingAdress(): string {
    adressInUse++;
    if (adressInUse >= adresses.length) {
        adressInUse = 0
    }
    return adresses[adressInUse]
}

export function CreateCustomer(user: Models.User): Models.User {
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/customer/register",
        data: {
            "email": user.email,
            "nickname": user.nickname,
            "firstname": user.firstName,
            "lastname": user.lastName,
            "phoneNumber": user.phoneNumber
        }
    };
    //récupérer l'id et le créer dans la bdd 
    return ph.user
}
export function GetCustomer(id: string): Models.User {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/customer/" + id,
    };

    //récupérer le mdp dans la bdd
    return ph.user
}
export function UpdateCustomer(user: Models.User): Models.User {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/" + user.type.toLowerCase() + "/" + user.id,
        data: {
            "email": user.email,
            "nickname": user.nickname,
            "firstname": user.firstName,
            "lastname": user.lastName,
            "phonenumber": user.phoneNumber,
        }
    };
    return ph.user;
}
export function DeleteUser(user: Models.User) {
    const config = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/" + user.type.toLowerCase() + user.id,

    };
}
export function GetCustommerHistory(user: Models.User): Array<Models.Order> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/" + user.type.toLowerCase() + "/" + user.id + "/history",

    };
    return [ph.order, ph.order]
}
export function SuspendCustommer(user: Models.User) {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/" + user.type.toLowerCase() + "/" + user.id + "/suspend",
    };
}
export function CreateRestaurant(restaurant: Models.Restaurants, user: Models.User) {
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/restaurant/register",
        data: {
            "userId": user.id,
            "name": restaurant.name,
            "address": restaurant.address,
            "phoneNumber": restaurant.phoneNumber,
            "email": restaurant.email
        }
    };
}
export function GetRestaurant(id: string) {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/restaurant/" + id,

    };
    return ph.restaurant;
}
export function UpdateRestaurant(restaurant: Models.Restaurants): Models.Restaurants {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAdress() + "/restaurant/" + restaurant.id,
        data: {
            "name": restaurant.name,
            "address": restaurant.address,
            "phoneNumber": restaurant.phoneNumber,
            "email": restaurant.email,
        }
    };
    return ph.restaurant;
}



