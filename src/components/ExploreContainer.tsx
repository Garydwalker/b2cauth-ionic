import { useMsal } from '@azure/msal-react';
import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
 
  return (
    <div className="container">
      <strong>{name}</strong>
      <div>
    
    </div>
    </div>
  );
};

export default ExploreContainer;
