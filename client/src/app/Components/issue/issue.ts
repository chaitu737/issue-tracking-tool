export interface Issue{
    issueId:string
    title:string,
    status:string,
    description:string,
    createdOn:Date
    reporter:string
    assigne?:string,
    _id?:string,
    _v?:number,
    image:File

}