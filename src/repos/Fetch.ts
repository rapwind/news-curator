import * as CherioClient from "cheerio-httpcli";
import * as Rx from "rxjs/Rx";

import RepoInterface, { IDetail } from "./IRepo";

export interface IFetch {
    detail(d: {}): IDetail;
    list(): Rx.Observable<IDetail>;
}

export default class Fetch implements IFetch {
    public repo: RepoInterface;

    constructor(repo: RepoInterface) {
        this.repo = repo;
    }

    public list(): Rx.Observable<IDetail> {
        return Rx.Observable.create(observer => {
            this.repo.keywords.forEach(k => {
                const res = CherioClient.fetchSync(
                    this.repo.query(k).url,
                    this.repo.query(k).param
                );
                this.repo.listParser(res.$("body")).each((_, e) => {
                    const i = this.repo.listItemParser(res.$(e));
                    if (typeof i !== "undefined") {
                        observer.next(Object.assign(this.repo.defaultData, i));
                    }
                });
            });
            observer.complete();
        });
    }

    public detail(d) {
        if (d.text !== undefined) {
            return d;
        }
        return Object.assign(
            d,
            this.repo.itemParser(CherioClient.fetchSync(d.url).$("body"))
        );
    }
}
