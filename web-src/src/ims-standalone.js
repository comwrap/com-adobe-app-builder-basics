import Runtime, { init } from '@adobe/exc-app'

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

require('./exc-runtime')

init(bootstrapInExcShell)

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