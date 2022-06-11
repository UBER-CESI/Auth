
import { AbilityBuilder, Ability } from '@casl/ability';
import { isErrored } from 'stream';
import * as Models from './Models'

export function GetAbilitiesFor(user: Models.User) {
    return (abilities[user.type](user));
}

const abilities: { [K: string]: Function } = {
    FinalUser: GetFinalUserAbilities,
    Deliverer: GetDelivererAbilities,
    Restaurateur: GetRestaurateurAbilities,
    Developper: GetDevelopperAbilities,
    Commercial: GetComemrcialAbilities,
    Technician: GetTechnicianAbilities
}


function GetFinalUserAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.Id });
    can('manage', 'order', { idOwner: user.Id });
    can('read', 'orderHistory', { idOwner: user.Id });
    can('read', 'orderDeliveryStatus', { idOwner: user.Id });
    can('create', 'sponsorLink', { idOwner: user.Id, type: user.type });

    return rules;
}

function GetRestaurateurAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.Id });
    can('manage', 'articles', { idRestaurant: user.idRestaurant });
    can('manage', 'menu', { idRestaurant: user.idRestaurant });
    can('read', 'order', { idRestaurant: user.idRestaurant });
    can('accept', 'order', { OrderStatus: Models.OrderStatus.Payed, idRestaurant: user.idRestaurant });
    can('read', 'orderDeliveryStatus', { idRestaurant: user.idRestaurant });
    can('read', 'orderHistory', { idRestaurant: user.idRestaurant });
    can('read', 'statistics', { idRestaurant: user.idRestaurant });
    can('create', 'sponsorLink', { idOwner: user.Id, type: user.type });

    return rules;
}
function GetDelivererAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.Id });
    can('accept', 'orders', { OrderStatus: Models.OrderStatus.Done });
    can('deliver', 'order', { OrderStatus: Models.OrderStatus.InDelivery, idDeliverer: user.id });
    can('create', 'sponsorLink', { idOwner: user.Id, type: user.type });
    return rules;
}
function GetDevelopperAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.Id });
    can('download', 'component');
    return rules;
}
function GetComemrcialAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);

    cannot('delete', 'BlogPost', {
        createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
    });
    return rules;
}

function GetTechnicianAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);

    cannot('delete', 'BlogPost', {
        createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
    });
    return rules;
}



