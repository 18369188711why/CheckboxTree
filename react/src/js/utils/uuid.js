export function getUuid(){
    return new Date().getDate();
};

export function getUuidEx(str){
    if(typeof str !== "string")
    {
        console.error("The input id is not string");
    }
    return str + getUuid();
}