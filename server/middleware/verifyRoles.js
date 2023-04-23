const verifyRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        //to bypass verify roles
        if(req.params.user=="god"){
            next();
        }
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role=>rolesArray.includes(role)).find(val => val===true);
        if(!result) return res.sendStatus(401);
        next();
    }
}
module.exports= verifyRoles;