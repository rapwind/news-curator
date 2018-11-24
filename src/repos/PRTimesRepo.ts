import * as moment from "moment";

import Fetch, { IFetch } from "./Fetch";
import RepoInterface from "./IRepo";

export default class PRTimesRepo implements RepoInterface {
    public fetch: IFetch;
    public keywords: string[];

    public defaultData = {
        color: "#294C7A",
        icon: "https://prtimes.jp/common/v4.1/images/html/favicon/favicon.ico",
        name: "PR TIMES",
        siteUrl: "https://prtimes.jp/"
    };

    constructor(keywords: string[]) {
        this.fetch = new Fetch(this);
        this.keywords = keywords;
    }

    public query = (q: string) => ({
        param: {},
        url: `https://prtimes.jp/topics/keywords/${encodeURI(q)}`
    });

    public listParser(e: Cheerio) {
        return e
            .find(".container-thumbnail-list")
            .find("article.item-ordinary");
    }

    public listItemParser(e: Cheerio) {
        return {
            author: e
                .find(".name-company-ordinary")
                .text()
                .replace(/^ +| +$|\n/gm, ""),
            publishedAt: moment(
                e.find(".time-release-ordinary").attr("datetime")
            ),
            title: e
                .find(".title-item-ordinary a")
                .text()
                .replace(/^ +| +$|\n/gm, ""),
            type: "prtimes",
            url: `https://prtimes.jp${e
                .find(".title-item-ordinary a")
                .attr("href")}`
        };
    }

    public itemParser(e: Cheerio) {
        return {
            text: `${e
                .find(".release--sub_title")
                .text()
                .replace(/( |　)|\n|\r|\t/gm, "")}\n${e
                .find(".r-head")
                .text()
                .replace(/( |　)|\n|\r|\t/gm, "")}`
        };
    }
}
