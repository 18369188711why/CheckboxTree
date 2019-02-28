import config from "../config"
import cn from "./zh_cn"
import en from "./en_us"

let locale = config.locale === 'zh-CN' ? cn : en;
export function setLocale(args){
    if (typeof arg === 'string') {
        locale = arg === 'zh_CN' ? cn : en;
      } 
};

export function getLocale(){
    return locale;
};

export function getMessage(key){
    return locale[key];
};