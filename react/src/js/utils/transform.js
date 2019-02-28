export const TRANSFORMS = {
    webkitTransform: '-webkit-transform',
    oTransform: '-o-transform',
    msTransform: '-ms-transform',
    mozTransform: '-moz-transform',
    transform: 'transform'
};
let transform = TRANSFORMS.transform;
export function getTransform(){
    return transform;
};

export function has3d() {
    if (!window.getComputedStyle) {
      return false
    }
  
    const element = document.createElement('p')
    let result
  
    
    document.body.insertBefore(element, null)
  
    Object.keys(TRANSFORMS).forEach((t) => {
      if (element.style[t] !== undefined) {
        element.style[t] = 'translate3d(1px,1px,1px)'
        transform = t
        result = window.getComputedStyle(element).getPropertyValue(TRANSFORMS[t])
      }
    })
  
    document.body.removeChild(element)
  
    return (result !== undefined && result.length > 0 && result !== 'none')
  };