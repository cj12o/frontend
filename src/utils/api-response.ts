class Apiresponse{
    public statusCode:number
    public data:object
    public message:string
    constructor(statusCode:number,message:string="Succesfully responded",data:object){
        this.message=message
        this.statusCode=statusCode
        this.data=data
    }
}

export default Apiresponse