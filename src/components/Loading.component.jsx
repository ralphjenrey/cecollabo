import { CircleLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircleLoader size={100} color="#2A2F7A" />
    </div>
  );
};

export default Loading;