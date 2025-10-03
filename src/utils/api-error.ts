class Apierror extends Error{
    public statusCode:number
    public errors:string []

    constructor(statusCode:number,message:string="Oops something went wrong",errors:string []=[],stack:any=""){
        super(message)
        this.statusCode=statusCode
        this.errors=errors
        if(stack){
            this.stack=stack
        }
        // }else{
        //     Error.captureStackTrace(this,this.constructor)
        // }
        
    }
}

export default Apierror