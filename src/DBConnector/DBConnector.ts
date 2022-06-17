import axios, { AxiosError, AxiosResponse } from "axios";
import { json } from "body-parser";
import { response } from "express";
import { request } from "http";
import * as Models from "../Models";
import *  as ph from "../PlaceHolders"


const serverType: { [K: string]: string[] | undefined } = {
    customer: process.env.ADDRESSES_CUSTOMERS?.split(","),
    restaurant: process.env.ADDRESSES_RESTAURANTS?.split(","),
    deliverer: process.env.ADDRESSES_DELIVERERS?.split(","),
    order: process.env.ADRESSES_ORDERS?.split(","),
    menu: process.env.ADRESSES_MENUS?.split(","),
    item: process.env.ADRESSES_ITEMS?.split(",")
}
export enum typeEnum {
    customer = "customer",
    restaurant = "restaurant",
    deliverer = "deliverer",
    order = "order",
    menu = "menu",
    item = "item"
}

export interface AxiosReturn {
    data?: AxiosResponse<any, any>,
    error?: boolean,
    status?: number

}
function getDataFromType(model, type: typeEnum): string | undefined {

    switch (type) {

        case typeEnum.customer:
            return JSON.stringify(model, ['email', 'nickname', 'firstname', 'lastname', 'phoneNumber'])
            break;
        case typeEnum.deliverer:

            return JSON.stringify(model, ['name'])
            break;
        case typeEnum.order:
            return JSON.stringify(model, ['customerId', 'delivererId', 'restaurantId', 'totalPrice', 'tipAmount', 'status', 'items', 'date', 'num'])
            break;
        case typeEnum.restaurant:
            return JSON.stringify(model, ['name', 'address', 'phoneNumber', 'email'])
            break;
        case typeEnum.menu:
            return JSON.stringify(model, ['name', 'description', 'items', 'price', 'restaurantId'])
            break;
        default:
            return "";
            break;
    }
}


function AskBDD(config): Promise<AxiosReturn> {

    return axios(config).then((response) => {

        return {
            error: false,
            data: response.data,
            status: (response.status === undefined) ? 200 : response.status
        }
    }).catch((e) => {
        return {
            error: true,
            data: e,
            status: 500
        }
    })
}


var addressInUse = 0;
export function getLoadBalancingAddress(type: typeEnum): string {
    console.log(type)
    addressInUse++;
    const addresses = serverType[type]
    if (addresses) {

        if (addressInUse >= addresses.length) {
            addressInUse = 0
        }

        return addresses[addressInUse]
    } else {
        return "Cannot get the address in DBConnector in auth server in getLoadBalancingAddress"
    }

}


export function Get(id: string, type: typeEnum, restUrl: string): Promise<AxiosReturn> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(type) + "/" + id + restUrl,
    };
    return AskBDD(config);
}
export function Delete(id: string, type: typeEnum, restUrl: string): Promise<AxiosReturn> {
    const config = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(type) + "/" + id + restUrl,
    };
    return AskBDD(config);
}
export function Create(model, type: typeEnum, restUrl: string) {
    var dataUp = JSON.stringify(model)
    console.log(dataUp);
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(type) + "/" + restUrl,
        data: dataUp
    }
    return AskBDD(config);
}
export function Update(model, type: typeEnum, restUrl: string) {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(type) + "/" + model.id + restUrl,
        data: getDataFromType(model, type)
    }
    return AskBDD(config);
}


//récupérer l'id et le créer dans la bdd 



export function SuspendCustomer(id: string, sus: string): Promise<AxiosReturn> {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(typeEnum.customer) + "/" + id + "/suspend",
        data: { "suspend": sus }

    };
    return AskBDD(config);
}



/*
export function DeleteRestaurant(idRestaurant: string) {
    const config = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant
    }
    return ph.restaurant;
}

export function GetRestaurantHistory(idRestaurant: string): Array<Models.Order> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant + "/history",

    };
    return [ph.order, ph.order]
}
export function GetRestaurantMenuAll(idRestaurant: string): Array<Models.Menu> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant + "/menu",
    }
    return [ph.menu, ph.menu];

}
export function CreateMenu(idRestaurant: string, menu: Models.Menu) {
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant + "/menu"
    }
    return ph.menu;
}
export function GetRestaurantMenu(idRestaurant: string, idMenu: string) {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant + "/menu/" + idMenu
    }

}


*/