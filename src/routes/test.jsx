import { useParams } from 'react-router-dom';

function Test() {
  const { id } = useParams();

  return (
    <div>
      <h1>{id} Album</h1>
      {/* Render album details */}
    </div>
  );
}

export default Test;