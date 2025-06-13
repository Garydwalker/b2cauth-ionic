import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
// Import your plugin directly (adjust the path/package as needed)
import { AuthProvider } from './components/AuthProvider';

setupIonicReact();

const App: React.FC = () => {
  // const [token, setToken] = useState<string>('');
  // useEffect(() => {
  //   MsAuthPlugin.login({
  //     clientId: 'c039f3db-0182-45ad-86cb-d3a1f3ec565e',
  //     tenant: 'gwplaygroundb2c.onmicrosoft.com',
  //     scopes: ['https://gwplaygroundb2c.onmicrosoft.com/6da3d7b7-2f40-4caa-9f8d-4077165e3bd8/blazor.access'],
  //     keyHash: 'TNdJ4zWrAFBTAVDjKvzOgpOrXsw=',
  //     authorityType: 'B2C',
  //     authorityUrl: 'https://gwplaygroundb2c.b2clogin.com/tfp/gwplaygroundb2c.onmicrosoft.com/B2C_1_signinsignup',
  //   })
  //     //@ts-ignore
  //     .then((result) => {
  //       console.log('Login successful', result);
  //       console.log(result.accessToken);
  //       setToken(result.accessToken);
  //     })
  //     //@ts-ignore
  //     .catch((error) => {
  //       console.error('Login failed', error);
  //       setToken(error.message);
  //     });
  // }, []);

  return (
    <AuthProvider>
      <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/tab1" component={Tab1} exact={true} />
                <Route path="/tab2" component={Tab2} exact={true} />
                <Route path="/tab3" component={Tab3} exact={true} />
                <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon icon={ellipse} />
                  <IonLabel>Tab 1</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon icon={square} />
                  <IonLabel>Tab 2</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon icon={triangle} />
                  <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
