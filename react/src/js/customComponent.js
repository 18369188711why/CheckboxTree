import React from "react"

function createComponent(name){
    const Base = React[name]
    return class extends Base {
      componentDidMount() {
        this.$isMounted = true
      }
  
      componentWillUnmount() {
        this.$isMounted = false
      }
  
      setState(...args) {
        if (this.$isMounted !== false) super.setState(...args)
      }
  
      forceUpdate() {
        if (this.$isMounted === true) super.forceUpdate()
        if (this.$isMounted === undefined) {
          if (this.forceUpdateTimer) clearTimeout(this.forceUpdateTimer)
          this.forceUpdateTimer = setTimeout(this.forceUpdate.bind(this))
        }
      }
    }
};

export const Component = createComponent("Component");
export const PureComponent = createComponent("PureComponent");