import axios, { AxiosError, AxiosResponse } from "axios";
import { json } from "body-parser";
import { response } from "express";
import { request } from "http";
import * as Models from "../Models";
import *  as ph from "../PlaceHolders"


export const serverType = {
    customer: process.env.ADDRESSES_CUSTOMERS?.split(","),
    restaurants: process.env.ADDRESSES_RESTAURANTS?.split(","),
    deliverers: process.env.ADDRESSES_DELIVERERS?.split(","),
    orders: process.env.ADRESSES_ORDERS?.split(",")


}
export interface AxiosReturn {
    data?: AxiosResponse<any, any>,
    error?: boolean,
    status?: number

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
function getLoadBalancingAddress(addresses?: string[]): string {
    addressInUse++;

    if (addresses) {

        if (addressInUse >= addresses.length) {
            addressInUse = 0
        }

        return addresses[addressInUse]
    } else {
        return "Cannot get the address in DBConnector in auth server in getLoadBalancingAddress"
    }

}

export function CreateCustomer(user: Models.User): Promise<AxiosReturn> {
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.customer),
        data: {
            "email": user.email,
            "nickname": user.nickname,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "phoneNumber": user.phoneNumber
        }
    };
    console.log(config.data)
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
    });



    //récupérer l'id et le créer dans la bdd 

}

export function Get(id: string, item?: string[]): Promise<AxiosReturn> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(item) + "/" + id,
    };
    return AskBDD(config);
}

export function UpdateCustomer(user: Models.User): Promise<AxiosReturn> {

    var dataUp = JSON.stringify(user)

    console.log(dataUp)
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.customer) + "/" + user.id,
        data: dataUp
    }
    return AskBDD(config);
}

export function Delete(id: string, item?: string[]): Promise<AxiosReturn> {
    const config = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(item) + "/" + id,
    };
    return AskBDD(config);
}
export function GetHistory(id: string, item?: string[]): Promise<AxiosReturn> {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(item) + "/" + id + "/history",
    };
    return AskBDD(config)
}
export function SuspendCustomer(id: string): Promise<AxiosReturn> {
    const config = {
        method: "SUSPEND",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.customer) + "/" + id + "/suspend"

    };
    return AskBDD(config);
}
/*
export function SuspendCustommer(user: Models.User) {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.custommer) + "/" + user.type.toLowerCase() + "/" + user.id + "/suspend",
    };
}
export function CreateRestaurant(restaurant: Models.Restaurants, user: Models.User) {
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/register",
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
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + id,

    };
    return ph.restaurant;
}
export function UpdateRestaurant(restaurant: Models.Restaurants): Models.Restaurants {
    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + restaurant.id,
        data: {
            "name": restaurant.name,
            "address": restaurant.address,
            "phoneNumber": restaurant.phoneNumber,
            "email": restaurant.email,
        }
    };
    return ph.restaurant;
}
export function DeleteRestaurant(idRestaurant: string) {
    const config = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant
    }
    return ph.restaurant;
}
export function GetRestaurantStats(idRestaurant: string) {
    const config = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: getLoadBalancingAddress(serverType.restaurant) + "/restaurant/" + idRestaurant + "/stats"
    }
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