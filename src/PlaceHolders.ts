import * as Models from "./Models"
export const user: Models.User = {
    firstName: "placeholder",
    email: "placeholder",
    id: "0",
    lastName: "placehoder",
    nickname: "placeholder",
    password: "placeholder",
    phoneNumber: "placeholder",
    type: Models.UserType.Custommer
}
export const restaurant: Models.Restaurants = {
    address: "placeholder",
    email: "placeholder@placeholder.pl",
    id: "placeholder",
    name: "placeholder",
    phoneNumber: "placeholder",
    userId: "placeholder"
}

export const order: Models.Order = {
    id: "placeholder",
    customerId: "placeholder",
    restaurantId: "placeholder",
    totalPrice: 0,
    tipAmount: 0,
    idDeliverer: "placeholder",
    status: Models.OrderStatus.Payed,
    listItems: [{
        allergens: ["placeholder", "placeholder"],
        descriptions: "placeholder",
        menuItems: ["placeholder", "placeholder"],
        name: "placeholder",
        options: [{
            multiple: true,
            name: "placeholder",
            required: true,
            values: [{
                value: "placeholder",
                priceOffset: 0
            }]
        }]

    }]
}