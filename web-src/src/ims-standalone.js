import Runtime, { init } from '@adobe/exc-app'

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

try {
  // attempt to load the Experience Cloud Runtime
  require('./exc-runtime')
  // if there are no errors, bootstrap the app in the Experience Cloud Shell
  init(bootstrapInExcShell)
} catch (e) {
  console.log('application not running in Adobe Experience Cloud Shell')
  // fallback mode, run the application without the Experience Cloud Runtime
  bootstrapRaw()
}
// Initialize the React app container
const container = document.getElementById('root');
const root = createRoot(container);

function bootstrapInExcShell () {
  // get the Experience Cloud Runtime object
  const runtime = Runtime()
  runtime.on('ready', ({ imsOrg, imsToken, imsProfile, locale }) => {
    // tell the exc-runtime object we are done
    runtime.done()
    console.log('Ready! received imsProfile:', imsProfile)
    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken
    }
    // Expose IMS credentials to window for use in index.html
    window.imsCredentials = ims

    root.render(<App />);
  })
}

function bootstrapRaw () {
  /* **here you can mock the exc runtime and ims objects** */
  const mockRuntime = { on: () => {} }
  const mockIms = {}

  // render the actual react application and pass along the runtime object to make it available to the App
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App runtime={mockRuntime} ims={mockIms} />);
}