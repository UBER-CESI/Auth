import { Ability, ExtractSubjectType, MongoQuery, Subject, SubjectRawRule } from "@casl/ability"
import { AnyObject } from "@casl/ability/dist/types/types";
import { Console } from "console";
import { userInfo } from "os"



export interface Account {
    id: string,
    idOwner: string
}
export interface User {
    id?: string;
    idType?: string;
    nickname: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    type: UserType;
    phoneNumber: string
    suspendedAt?: string
}
export enum UserType {
    Customer = "Customer",
    Deliverer = "Deliverer",
    Restaurant = "Restaurant",
    Developper = "Developper",
    Commercial = "Commercial",
    Technician = "Technician",
    Admin = "Admin"
}

export interface Order {
    id: string,
    customerId: string,
    restaurantId: string,
    totalPrice: number,
    tipAmount: number,
    idDeliverer: string,
    status: OrderStatus,
    listItems: Array<Items>

}
export interface Items {
    name?: string,
    descriptions?: string,
    allergens?: Array<string>,
    menuItems?: Array<string>,
    options?: Array<Option>,
}
export interface Option {
    name: string,
    multiple: boolean,
    required: boolean,
    values: Array<Values>
}
export interface Values {
    value: string,
    priceOffset: number
}
export enum OrderStatus {
    Payed = "Payed",
    Making = "Making",
    Done = "Done",
    InDelivery = "InDelivery",
    Delivered = "Delivered",
}


export interface Article {
    id: string,
    idRestaurant: string,
    name: string,
    price: number,
    type: ArticleType
}
export enum ArticleType {
    Dish = "Dish",
    Drink = "Drink",
    Sauce = "Sauce",
    SideDish = "SideDish"
}
export interface ArticleMenu {
    idArticle: string,
    idMenu: string
}
export interface menuOrder {

    idOrder: string,
    idMenu: string
}
export interface Menu {
    id: string,
    restaurantId: string,
    items: Array<string>,
    name: string,
    price: number,
}
export interface Restaurants {
    id: string,
    userId: string,
    name: string,
    address: string,
    phoneNumber: string,
    email: string
}







