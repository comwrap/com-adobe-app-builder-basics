import { register } from '@adobe/uix-guest';
import { useEffect } from 'react';
import App from '../App';

const extensionId = 'simpleApp';

export default function ExtensionRegistration(props) {
    useEffect(() => {
        (async () => {
            await register({
                id: extensionId,
                methods: {}
            });
        })();
    }, []);

    return <App runtime={props.runtime} ims={props.ims} />;
}

