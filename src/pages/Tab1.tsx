import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { useAuth } from '../hooks/useAuth';

const Tab1: React.FC = () => {
  const {mode,config, token, login, logout, error } = useAuth();



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <button onClick={login}>Login</button>
          <button onClick={logout}>Logout</button>
          <div>Token: {token}</div>
          <div>Error: {error}</div>
          <div>Mode: {mode}</div>
          <div>Config: {JSON.stringify(config)}</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
