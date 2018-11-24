import * as moment from "moment";
import * as Rx from "rxjs/Rx";
import * as sqlite3 from "sqlite3";

export default class Cache {
    public db: sqlite3.Database;

    constructor() {
        sqlite3.verbose();
        this.db = new sqlite3.Database("news.db");
        this.initial();
    }

    public async initial() {
        await this.db.serialize(() => {
            const select = new Promise((resolve, _) => {
                this.db.get(
                    'select count(*) from sqlite_master where type="table" and name=$name',
                    { $name: "news" },
                    (err, res) => {
                        resolve(0 < res["count(*)"]);
                    }
                );
            });

            select.then(exists => {
                if (!exists) {
                    this.db.run(
                        "create table news (id integer primary key, url text unique, title text, published_at datetime, type text)",
                        (res, err) => {
                            return;
                        }
                    );
                } else {
                    return;
                }
            });
        });
    }

    public set(data: {
        url: string;
        title: string;
        type: string;
        publishedAt: moment.Moment;
    }): Rx.Observable<any> {
        data = Object.assign({}, data);
        return Rx.Observable.create(async observer => {
            this.db.run(
                "insert into news (url, title, published_at, type) values ($url, $title, $publishedAt, $type)",
                Object.assign({
                    $publishedAt: data.publishedAt.toISOString(),
                    $title: data.title,
                    $type: data.type,
                    $url: data.url
                }),
                err => {
                    if (err) {
                        observer.error(err);
                    } else {
                        observer.next(data);
                    }
                    observer.complete();
                }
            );
        });
    }

    // set(data) {
    //     data = Object.assign({}, data);
    //     return new Promise<{ title?: string }>(async (resolve, reject) => {
    //         this.db.run('insert into news (url, title, published_at, type) values ($url, $title, $publishedAt, $type)',
    //         Object.assign({
    //             $url: data.url,
    //             $title: data.title,
    //             $type: data.type,
    //             $publishedAt: data.publishedAt.toISOString()
    //         }),
    //         (err) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }

    public async close() {
        await this.db.close();
    }
}
