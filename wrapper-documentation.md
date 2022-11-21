---
description: Documentation for Tokium Wrapper
---

# Wrapper Documentation

React UI kit that implements the Tokium SDK. For implementation see demo app in [github](https://github.com/TokiumSOL/TokiumWrapper/tree/main/react-ui/src)

### TokiumContext

Initialize token and royalty gating by wrapping your app routes and components. The context provider will provide verified status to the `GatedRoute` and `Lockscreen` components.

```
<TokiumProvider pubkey={pubkey} collection={collection}>
    // Routes go here
</TokiumProvider>
```

### GatedRoute

Gate a route in the Router component (from react-router-dom) Unauthorized users will be redirected to the path provided by `redirect`. Authorized users will be able to access components wrapped by `GatedRoute`.

```
<Route path='/GatedSite' element={
  <GatedRoute redirect='/'>
       {<GatedComponent />}
  </GatedRoute>
  }
/>
```

### Lockscreen

A UI Component preventing gated content from rendering. Pass in desired width of the wrapper as a style prop.

```
import { Lockscreen } from '@tokium.co/tokiumwrapper'

function App() {
    return (
      <div className='locked-component'>
        <Lockscreen style={{width: '370px'}}>
          // Gated Content
        </Lockscreen>
      </div>
    )
}
```

