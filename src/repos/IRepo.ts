import * as moment from "moment";

import { IFetch } from "./Fetch";

export interface IDetail {
    title: string;
    url: string;
    publishedAt: moment.Moment;
    type: string;
    author?: string;
    text?: string;
    name: string;
    icon?: string;
    color?: string;
    siteUrl: string;
}

export default interface IRepo {
    fetch: IFetch;
    defaultData: {
        name: string;
        siteUrl: string;
        icon: string;
        color: string;
    };
    keywords: string[];
    query(
        q: string
    ): {
        url: string;
        param: { [name: string]: any };
    };
    listParser(dom: Cheerio): Cheerio;
    listItemParser(
        dom: Cheerio
    ): {
        title: string;
        url: string;
        publishedAt: moment.Moment;
        type: string;
        author?: string;
        text?: string;
    };
    itemParser(
        dom: Cheerio
    ): {
        author?: string;
        text?: string;
        publishedAt?: moment.Moment;
    };
}
