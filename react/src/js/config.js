const config = { 
    cssModule: process.env.CSS_MODULE || false,
    prefix: process.env.SO_PREFIX || 'so',
    locale:process.env.locale||"zh_CN"
};
export default config;
function setConfig(conf){
    Object.assign(config,conf);
}