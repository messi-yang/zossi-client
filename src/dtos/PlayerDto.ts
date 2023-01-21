import CameraDto from './CameraDto';
import LocationDto from './LocationDto';

type PlayerDto = {
  id: string;
  name: string;
  location: LocationDto;
  camera: CameraDto;
};

export default PlayerDto;
