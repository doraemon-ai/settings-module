import ReactDOM from 'react-dom'
import App from './src/App'

export default {

  bootstrap: async (props: any) => {
    return Promise.resolve()
  },

  unmount: async (props: any) => {
    ReactDOM.unmountComponentAtNode(props.container)
  },

  mount: async (props: { container: any, onGlobalStateChange: (params: any) => void }) => {
    props.onGlobalStateChange((event: { category: string, params: any }, prevEvent: any) => { // event: 变更后的状态; prevEvent 变更前的状态
      switch (event.category) {
        case 'ACTION':
          break
        case 'FEEDBACK':
          break
      }
    })

    ReactDOM.render(<App />, props.container)
  },
}

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.render(<App />, document.getElementById("root"))
}
