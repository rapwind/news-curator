import { IDetail } from "../repos/IRepo";

export default class MessageImpl {
    public detail: IDetail;
    public getAttachmentBody: string;

    constructor(detail: IDetail) {
        this.detail = detail;
    }

    public toString() {
        return this.getAttachmentBody;
    }
}
