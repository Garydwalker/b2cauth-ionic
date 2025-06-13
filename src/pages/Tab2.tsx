import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { useAuth } from '../hooks/useAuth';

const Tab2: React.FC = () => {

    const {  user } = useAuth();
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        {user && (
          <table>
            <thead>
              <tr>
          <th>Property</th>
          <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(user).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{String(value)}</td>
          </tr>
              ))}
            </tbody>
          </table>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
