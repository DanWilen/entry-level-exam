import {Ticket} from '../client/src/api';

const data = require('./data.json') as Ticket[];

export function getSortedData(sortBy:keyof Ticket, ascending:boolean) {
    return data.sort((ticket1, ticket2) => ascending
        ? ticket1[sortBy]! > ticket2[sortBy]! ? -1 : 1
        : ticket1[sortBy]! < ticket2[sortBy]! ? -1 : 1
    )
}

