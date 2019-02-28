import classnames from "classnames"
import config from "config"

export default(style,cssModule,prefix = config.prefix)=>(...args) =>{
    const className = classnames(...args)
    if (!className) return ''
  
    const ns = `${prefix}${cssModule ? `-${cssModule}` : '-'}`
    let list = className.split(' ').map(c => (c === '_' ? ns : `${ns}-${c}`))
    if (config.cssModule) {
      list = list.map(c => style[c])
    }
    return list.join(' ')
}