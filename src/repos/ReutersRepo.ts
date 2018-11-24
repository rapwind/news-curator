import * as moment from "moment";

import Fetch, { IFetch } from "./Fetch";
import IRepo from "./IRepo";

export default class ReutersRepo implements IRepo {
    public fetch: IFetch;
    public keywords: string[];

    public defaultData = {
        color: "#f37021",
        icon:
            "https://s3.reutersmedia.net/resources_v2/images/favicon/favicon.ico",
        name: "ロイター",
        siteUrl: "https://jp.reuters.com/"
    };

    constructor(keywords: string[]) {
        this.fetch = new Fetch(this);
        this.keywords = keywords;
    }

    public query = (q: string) => ({
        param: { blob: q, sortBy: "date", dateRange: "pastDay" },
        url: "https://jp.reuters.com/search/news"
    });

    public listParser(e: Cheerio) {
        return e.find(".search-result-indiv");
    }

    public listItemParser(e: Cheerio) {
        const timeRegexp = new RegExp(
            "([0-9]{4})年 ([0-9]{1,2})月 ([0-9]{1,2})日 ([0-9]{1,2}):([0-9]{1,2})",
            "g"
        );
        const timeArray = timeRegexp.exec(
            e.find(".search-result-timestamp").text()
        );

        return {
            publishedAt: moment(
                new Date(
                    parseInt(timeArray[1], 10),
                    parseInt(timeArray[2], 10) - 1,
                    parseInt(timeArray[3], 10),
                    parseInt(timeArray[4], 10),
                    parseInt(timeArray[5], 10)
                )
            ).utcOffset(9, true),
            title: e
                .find(".search-result-title a")
                .text()
                .replace(/^ +| +$|\n|\r|\t/gm, ""),
            type: "reuters",
            url: `https://jp.reuters.com${e
                .find(".search-result-title a")
                .attr("href")}`
        };
    }

    public itemParser(e: Cheerio) {
        return {
            author: "",
            text: ""
        };
    }
}
